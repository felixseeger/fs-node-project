import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/moderate', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Moderation] GOOGLE_GEMINI_API_KEY is not set. Skipping toxicity check.');
      return res.json({ safe: true });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following text for severe toxicity, hate speech, harassment, or abuse. Ignore mild profanity.
Answer strictly in JSON format: {"safe": boolean, "reason": "string (empty if safe)"}

Text: "${text.replace(/"/g, '\\"')}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let parsed = { safe: true, reason: '' };
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = JSON.parse(responseText);
    }

    res.json(parsed);
  } catch (error) {
    console.error('[Moderation] Error checking toxicity:', error.message || error);
    // Fail open if the model throws an error
    res.json({ safe: true, error: error.message });
  }
});

export default router;
