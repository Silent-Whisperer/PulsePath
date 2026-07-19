import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  compressionMiddleware,
  corsMiddleware,
  helmetMiddleware,
  globalLimiter,
  aiLimiter,
  tightJsonParser,
  errorHandlingMiddleware,
} from './server/middleware/security.middleware';
import { handleAIRequest } from './server/controllers/ai.controller';
import { detectPromptInjection } from './server/utils/prompt-detector';

dotenv.config();

export { detectPromptInjection };
export const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Performance: Apply Gzip compression
app.use(compressionMiddleware);

// Security: Enable CORS
app.use(corsMiddleware);

// Security: Disable X-Powered-By header
app.disable('x-powered-by');

// Security: Helmet Hardened Content Security Policy
app.use(helmetMiddleware);

// Security: Global Rate Limiter
app.use(globalLimiter);

// API routes
app.post('/api/ai', aiLimiter, tightJsonParser, handleAIRequest);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Secure Error Handling Middleware
app.use(errorHandlingMiddleware);

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
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}
