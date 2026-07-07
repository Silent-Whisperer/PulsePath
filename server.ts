/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Performance: Apply Gzip compression
app.use(compression());

// 2. Security: Disable X-Powered-By header
app.disable('x-powered-by');

// 3. Security: Helmet Hardened Content Security Policy (Leaflet maps & Gemini API compliant)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: process.env.NODE_ENV === "production"
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org", "https://*.basemaps.cartocdn.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
  })
);

// 4. Security: Global Rate Limiter (Protection against general DoS)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use(globalLimiter);

// 5. Security: Specific Rate Limiter for AI endpoints to prevent Gemini API quota abuse
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to the AI engine, please wait a minute.' }
});

// 6. Security: Enforce tight body parsing boundaries (DOS Mitigation)
const tightJsonParser = express.json({ limit: '10kb' });

// 7. Security: Prompt Injection Detector Helper
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  const lowercase = text.toLowerCase();
  
  // Normalize text: remove special characters, collapse spacing
  const normalized = lowercase
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const injectionPatterns = [
    'ignore previous instructions',
    'ignore all previous',
    'system override',
    'developer mode',
    'you are now a',
    'new instruction',
    'bypass restrictions',
    'do not mention',
    'jailbreak',
    'pretend to be',
    'dan mode',
    'rule override',
    'forget your instructions',
    'forget everything'
  ];
  return injectionPatterns.some(pattern => normalized.includes(pattern) || lowercase.includes(pattern));
}

// 8. Initialize Gemini sdk with user agent headers
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'pulsepath-ai' } }
    })
  : null;

// API routes
app.post('/api/ai', aiLimiter, tightJsonParser, async (req, res) => {
  const { prompt, role, language, context } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt parameter' });
  }

  // Type validation checks for other inputs
  if (role && typeof role !== 'string') {
    return res.status(400).json({ error: 'Invalid role parameter' });
  }
  if (language && typeof language !== 'string') {
    return res.status(400).json({ error: 'Invalid language parameter' });
  }
  if (context && typeof context !== 'object') {
    return res.status(400).json({ error: 'Invalid context parameter' });
  }

  // DOS mitigation: length limit validation
  if (prompt.length > 1000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum length of 1000 characters' });
  }

  // Prompt injection mitigation
  if (detectPromptInjection(prompt)) {
    return res.status(400).json({ error: 'Security validation failed: Prohibited instruction pattern detected.' });
  }

  if (!ai) {
    return res.status(503).json({ error: 'AI service unavailable (API Key not configured)' });
  }

  try {
    const systemInstruction = `
      You are PULSEPATH, an intelligent stadium operations and fan-experience AI for the FIFA World Cup 2026 (Global Football 2026).
      Current User Role: ${role}
      Language: ${language}
      Context: ${JSON.stringify(context)}
      
      Guidelines:
      - Use current simulated venue context.
      - Never invent emergency instructions.
      - Escalates medical, safety, and lost-child situations to venue staff.
      - Give concise, actionable guidance.
      - Clearly label recommendations as AI-generated if appropriate.
      - Support multilingual output in the requested language: ${language}.
      - IMPORTANT: Never use long decimal numbers (e.g., 14.800000000000002). Always round to the nearest whole number for queue times and 1-2 decimal places for density.
      - Disclaimer: "Demo simulation. Verify critical instructions with venue staff."
    `;

    // Helper for retry logic
    const generateWithRetry = async (retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const result = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              systemInstruction: { parts: [{ text: systemInstruction }] },
              temperature: 0.7,
            },
          });
          return result.text;
        } catch (error: any) {
          const isRetryable = error?.status === 'UNAVAILABLE' || error?.message?.includes('503') || error?.message?.includes('high demand');
          if (isRetryable && i < retries - 1) {
            console.warn(`Gemini busy, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            continue;
          }
          throw error;
        }
      }
    };

    const text = await generateWithRetry();
    res.json({ text });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Secure Error Handling Middleware
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProduction ? 'A secure server error occurred.' : err.message
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serves static files with performance-boosting Cache-Control headers
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
