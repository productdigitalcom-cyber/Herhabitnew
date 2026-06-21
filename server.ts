import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

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
          englishName: { type: Type.STRING, description: "The English name of the dish for image generation purposes." },
          imageUrl: { type: Type.STRING, description: "A valid, real, high-resolution original image URL from a public internet source (like Wikimedia Commons) showing this exact dish. Return ONLY a direct URL to a JPG/PNG." },
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
        required: ["id", "name", "englishName", "imageUrl", "cuisine", "prepTime", "cookTime", "servings", "difficulty", "ingredients", "instructions", "tips"],
      };

      const prompt = `Generate a realistic and detailed recipe for the following search query: "${query}". 
      Make sure to provide cuisine origin, prep time, cook time, servings, difficulty, ingredients list, step-by-step instructions, tips and variations, and nutritional information if possible.
      Include 'englishName' for the dish name translated to English.
      Include 'imageUrl' which MUST be a real, valid public URL of an image of this dish from the internet (e.g. from Wikimedia Commons). DO NOT use AI image generators in the URL.
      IMPORTANT: Respond entirely in the language of the search query "${query}" (e.g., if the query is in Arabic, respond in Arabic. If the query is in French, respond in French or English. If the query is in English, respond in English).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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

  // API handler for Gemini Recipe scan from image
  app.post("/api/recipe/scan", async (req, res) => {
    try {
      const { imageBase64, language = "English" } = req.body;
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
          englishName: { type: Type.STRING, description: "The English name of the dish for image generation purposes." },
          imageUrl: { type: Type.STRING, description: "A valid, real, high-resolution original image URL from a public internet source (like Wikimedia Commons) showing this exact dish. Return ONLY a direct URL to a JPG/PNG." },
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
        required: ["id", "name", "englishName", "imageUrl", "cuisine", "prepTime", "cookTime", "servings", "difficulty", "ingredients", "instructions", "tips"],
      };

      const prompt = `Analyze this image of a refrigerator or ingredients. 
      Identify the edible ingredients visible and generate a realistic, delicious recipe using some or all of these ingredients. 
      Make sure to provide cuisine origin, prep time, cook time, servings, difficulty, ingredients list, step-by-step instructions, tips and variations, and nutritional information if possible.
      Include 'englishName' for the dish name translated to English.
      Include 'imageUrl' which MUST be a real, valid public URL of an image of this dish from the internet (e.g. from Wikimedia Commons). DO NOT use AI image generators in the URL.
      Please respond entirely in ${language}.`;

      // Extract base64 data without the data:image/... base64 prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ],
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
      console.error("Recipe scan error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API handler for recipe chat
  app.post("/api/recipe/chat", async (req, res) => {
    try {
      const { recipe, question, history = [], language = "English" } = req.body;
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

Answer the user's question about this recipe concisely.
Please respond entirely in ${language}.`;

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
        model: "gemini-3.5-flash",
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

  // API handler for array text translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { texts, targetLang } = req.body;
      if (!texts || !Array.isArray(texts)) return res.status(400).json({ error: "Invalid texts array" });
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const langName = targetLang === 'fr' ? 'French' : (targetLang === 'ar' ? 'Arabic' : 'English');
      
      const payload = JSON.stringify(texts);
      const prompt = `Translate this JSON array of UI strings into ${langName}. Preserve the exact JSON array structure and order. Return ONLY the JSON array.\n\n${payload}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      
      const responseText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
      const translatedTexts = JSON.parse(responseText);
      
      res.json(translatedTexts);
    } catch (err: any) {
      console.error("Translate error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API handler for wellness AI parsing
  app.post("/api/wellness/parse", async (req, res) => {
    try {
      const { query } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const wellnessSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, description: "One of: LOG_HEALTH, ADD_HABIT, ADD_ROUTINE, ADD_KID_SCHEDULE" },
          health: { 
            type: Type.OBJECT,
            properties: { steps: { type: Type.INTEGER }, sleepHours: { type: Type.INTEGER }, sleepMinutes: { type: Type.INTEGER }, workout: { type: Type.STRING } }
          },
          habitName: { type: Type.STRING },
          routineName: { type: Type.STRING },
          routineTime: { type: Type.STRING },
          kidActivity: { type: Type.STRING },
          kidTime: { type: Type.STRING },
          kidName: { type: Type.STRING }
        },
        required: ["action"],
      };

      const prompt = `Parse the user's intent into a structured wellness command.
Query: "${query}"

Examples:
- "I walked 5000 steps" -> action: LOG_HEALTH, health: { steps: 5000 }
- "Drink water everyday" -> action: ADD_HABIT, habitName: "Drink Water"
- "Evening skincare at 9 PM" -> action: ADD_ROUTINE, routineName: "Evening Skincare", routineTime: "09:00 PM"
- "Lina has piano at 5 PM" -> action: ADD_KID_SCHEDULE, kidActivity: "Piano", kidTime: "17:00", kidName: "Lina"
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: wellnessSchema,
        }
      });

      if (response.text) {
        res.json(JSON.parse(response.text));
      } else {
        res.status(500).json({ error: "No text returned from API" });
      }
    } catch (err: any) {
      console.error("Wellness parsing error:", err);
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
