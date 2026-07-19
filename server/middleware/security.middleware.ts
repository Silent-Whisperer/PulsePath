/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// 1. Gzip compression
export const compressionMiddleware = compression();

// 2. CORS Middleware
export const corsMiddleware = cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? false // Or specific domain names
      : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// 2. Helmet Hardened Content Security Policy (Leaflet maps & Gemini API compliant)
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:
        process.env.NODE_ENV === 'production'
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https://*.tile.openstreetmap.org',
        'https://*.basemaps.cartocdn.com',
      ],
      connectSrc: ["'self'", 'https://generativelanguage.googleapis.com'],
    },
  },
});

// 3. Global Rate Limiter (Protection against general DoS)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

// 4. Specific Rate Limiter for AI endpoints to prevent Gemini API quota abuse
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to the AI engine, please wait a minute.' },
});

// 5. Enforce tight body parsing boundaries (DOS Mitigation)
export const tightJsonParser = express.json({ limit: '10kb' });

// 6. Secure Error Handling Middleware
export const errorHandlingMiddleware = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Unhandled server error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProduction ? 'A secure server error occurred.' : err.message,
  });
};
