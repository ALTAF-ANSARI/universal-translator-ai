const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const History = require('../models/History');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// POST /api/translate
router.post('/', protect, async (req, res) => {
  try {
    const { text, source, target } = req.body;
    if (!text || !source || !target)
      return res.status(400).json({ message: 'text, source and target are required' });

    // Using Google Gemini API for translation
    const prompt = `Translate the following text from ${source} to ${target}: "${text}". Only return the translated text without any explanations or additional formatting.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    if (!translatedText) {
      throw new Error('Translation failed: Empty response from AI');
    }

    // Save to history
    await History.create({
      user: req.user._id,
      sourceText: text,
      translatedText,
      sourceLang: source,
      targetLang: target
    });

    res.json({ translatedText });
  } catch (err) {
    console.error('Translation Error:', err);
    res.status(500).json({ message: `Translation failed: ${err.message}` });
  }
});

// GET /api/translate/languages
router.get('/languages', async (req, res) => {
  // MyMemory supports these languages — return static list
  res.json([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ko', name: 'Korean' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ur', name: 'Urdu' },
    { code: 'tr', name: 'Turkish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' }
  ]);
});

module.exports = router;
