import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API handler for Gemini Recipe search
  app.post("/api/recipe/search", async (req, res) => {
    try {
      const { query } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const recipeSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          servings: { type: Type.INTEGER },
          difficulty: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutrition: { 
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.INTEGER },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fat: { type: Type.STRING }
            }
          }
        },
        required: ["id", "name", "cuisine", "prepTime", "cookTime", "servings", "difficulty", "ingredients", "instructions", "tips"],
      };

      const prompt = `Generate a realistic and detailed recipe for the following search query: "${query}". 
      Make sure to provide cuisine origin, prep time, cook time, servings, difficulty, ingredients list, step-by-step instructions, tips and variations, and nutritional information if possible.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: recipeSchema,
        }
      });

      if (response.text) {
        res.json(JSON.parse(response.text));
      } else {
        res.status(500).json({ error: "No text returned from Gemini API" });
      }
    } catch (err: any) {
      console.error("Recipe generation error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API handler for recipe chat
  app.post("/api/recipe/chat", async (req, res) => {
    try {
      const { recipe, question, history = [] } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are a helpful cooking assistant.
Recipe Context:
Name: ${recipe.name}
Ingredients: ${recipe.ingredients.join(', ')}
Instructions: ${recipe.instructions.join(' ')}

Answer the user's question about this recipe concisely.`;

      // Map over frontend history to match SDK model requirements
      // The frontend uses { role: 'user' | 'assistant', text: string }
      // The SDK uses { role: 'user' | 'model', parts: [{ text: string }] }
      const formattedHistory = history
        .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        config: {
          systemInstruction,
        },
        history: formattedHistory,
      });

      const response = await chat.sendMessage({ message: question });

      res.json({ answer: response.text });
    } catch (err: any) {
      console.error("Recipe chat error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
