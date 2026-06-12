import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'carbonbuddy-ai',
    }
  }
});

// AI Coach endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, assessment } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid messages parameter" });
    }
    if (!assessment) {
      return res.status(400).json({ error: "Missing assessment data parameter" });
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
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    // Note: The SDK chat.sendMessage typically handles history internally if you use the same chat object,
    // but for stateless API calls we might need to send the full context or use generateContent.
    // However, ai.chats.create can take history.
    
    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Document extraction endpoint
app.post("/api/analyze-receipt", async (req, res) => {
  try {
    const { image } = req.body; // base64
    if (!image || typeof image !== 'string' || !image.includes(',')) {
      return res.status(400).json({ error: "Missing or invalid base64 image data parameter" });
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
        mimeType: "image/jpeg", // Assuming jpeg for demo
        data: image.split(',')[1], // Remove prefix if present
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
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message });
  }
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
