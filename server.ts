import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { AssessmentData, Message } from "./src/types";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security and Performance Middleware
app.disable('x-powered-by');
app.use(compression());

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
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
  })
);

// Global Rate Limiter for protection against DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use(limiter);

// Specific Rate Limiter for AI endpoints to prevent Gemini API quota abuse
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests to the AI engine, please wait a minute." }
});

// Dedicated parsers for specific payload requirements
const rawJsonParser = express.json({ limit: '10mb' }); // parser for receipt scanner
const tightJsonParser = express.json({ limit: '10kb' }); // general tight body parser

// Helper to detect common prompt injection patterns
export function detectPromptInjection(text: string): boolean {
  const lowercase = text.toLowerCase();
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all previous",
    "system override",
    "developer mode",
    "you are now a",
    "new instruction",
    "bypass restrictions",
    "do not mention",
    "jailbreak"
  ];
  return injectionPatterns.some(pattern => lowercase.includes(pattern));
}

// Helper to validate structured Assessment Data
export function validateAssessment(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Record<string, any>;
  const { transportation, travel, energy, food, shopping, waste } = d;
  
  if (!transportation || typeof transportation.mileage !== 'number' || !['gas', 'electric', 'hybrid', 'public', 'bike'].includes(transportation.type)) return false;
  if (!travel || typeof travel.shortFlights !== 'number' || typeof travel.longFlights !== 'number') return false;
  if (!energy || typeof energy.electricityMonthly !== 'number' || !['gas', 'electric', 'oil', 'wood'].includes(energy.heatingSource) || !['apartment', 'small', 'medium', 'large'].includes(energy.houseSize) || typeof energy.renewableEnergy !== 'number') return false;
  if (!food || !['heavy-meat', 'meat', 'vegetarian', 'vegan'].includes(food.diet) || typeof food.localSourcing !== 'number' || !['low', 'medium', 'high'].includes(food.foodWaste)) return false;
  if (!shopping || !['low', 'medium', 'high'].includes(shopping.frequency) || !['low', 'medium', 'high'].includes(shopping.clothingFreq)) return false;
  if (!waste || typeof waste.recycling !== 'boolean' || typeof waste.composting !== 'boolean') return false;
  
  return true;
}

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'carbonbuddy-ai',
    }
  }
});

// Document extraction endpoint (Accepts base64 image up to 10MB)
app.post("/api/analyze-receipt", apiLimiter, rawJsonParser, async (req, res) => {
  try {
    const { image } = req.body;
    const match = image.match(/^data:([^;]+);base64,/);
    const mimeType = match ? match[1] : "image/jpeg";
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ error: "Unsupported image format. Please upload JPG, PNG, or WEBP." });
    }

    const prompt = `Extract carbon-relevant data from this electricity bill or fuel receipt. 
    Return a JSON object with:
    - type: "electricity" or "fuel"
    - amount: numeric value (kWh for electricity, Liters or Gallons for fuel)
    - unit: the unit of measurement
    - total_cost: if available
    - emissions_estimate: a rough estimate in kg CO2 if you can infer it.
    
    Format the response as pure JSON.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: image.split(',')[1],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    const isProduction = process.env.NODE_ENV === "production";
    res.status(500).json({ error: isProduction ? "An error occurred while analyzing the document." : errMessage });
  }
});

// AI Coach endpoint (Restricted payload size of 10KB)
app.post("/api/chat", apiLimiter, tightJsonParser, async (req, res) => {
  try {
    const { messages, assessment } = req.body as { messages: Message[], assessment: AssessmentData };
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid messages parameter" });
    }
    const isValidMessages = messages.every(m => 
      m && typeof m === 'object' && 
      (m.role === 'user' || m.role === 'assistant' || m.role === 'model') && 
      typeof m.content === 'string'
    );
    if (!isValidMessages) {
      return res.status(400).json({ error: "Invalid message format inside history" });
    }
    if (!assessment || !validateAssessment(assessment)) {
      return res.status(400).json({ error: "Missing or invalid assessment data parameter" });
    }
    
    const lastMessage = messages[messages.length - 1]?.content;
    if (!lastMessage || typeof lastMessage !== 'string') {
      return res.status(400).json({ error: "Invalid user message" });
    }

    // 1. DOS Protection: Enforce maximum text length limit
    if (lastMessage.length > 2000) {
      return res.status(400).json({ error: "Message exceeds maximum length of 2000 characters" });
    }

    // 2. Prompt Injection Defense: Detect hijacking patterns
    if (detectPromptInjection(lastMessage)) {
      return res.status(400).json({ error: "Security validation failed: Prohibited instruction pattern detected." });
    }
    
    const systemInstruction = `You are CarbonBuddy AI, a friendly and knowledgeable sustainability coach. 
    A user has completed their carbon footprint assessment. Here is their data: ${JSON.stringify(assessment)}.
    Use this context to provide personalized, actionable, and encouraging advice. 
    Keep responses concise and focused on behavior change.
    Do not use complex jargon. Convert impact into relatable metrics where possible.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
    });

    // Send the history except the last one which is the new prompt
    const history = messages.slice(0, -1).map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    const isProduction = process.env.NODE_ENV === "production";
    res.status(500).json({ error: isProduction ? "An error occurred during the AI chat session." : errMessage });
  }
});

// Secure Error Handling Middleware
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  const isProduction = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: isProduction ? "A secure server error occurred." : err.message
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
