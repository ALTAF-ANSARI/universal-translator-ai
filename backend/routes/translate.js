const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const History = require('../models/History');
const router = express.Router();

// POST /api/translate
router.post('/', protect, async (req, res) => {
  try {
    const { text, source, target } = req.body;
    if (!text || !source || !target)
      return res.status(400).json({ message: 'text, source and target are required' });

    const libreUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
    const body = {
      q: text,
      source,
      target,
      format: 'text'
    };

    if (process.env.LIBRETRANSLATE_API_KEY && process.env.LIBRETRANSLATE_API_KEY !== 'your_api_key_here') {
      body.api_key = process.env.LIBRETRANSLATE_API_KEY;
    }

    const response = await axios.post(`${libreUrl}/translate`, body, {
      headers: { 'Content-Type': 'application/json' }
    });

    const translatedText = response.data.translatedText;

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
    const msg = err.response?.data?.error || err.message;
    res.status(500).json({ message: `Translation failed: ${msg}` });
  }
});

// GET /api/translate/languages
router.get('/languages', async (req, res) => {
  try {
    const libreUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
    const response = await axios.get(`${libreUrl}/languages`);
    res.json(response.data);
  } catch (err) {
    // Return common languages as fallback
    res.json([
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ko', name: 'Korean' }
    ]);
  }
});

module.exports = router;
