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

    // Use MyMemory free API (no API key required, 5000 chars/day free)
    const langPair = `${source}|${target}`;
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: langPair
      }
    });

    if (response.data.responseStatus !== 200) {
      throw new Error(response.data.responseDetails || 'Translation failed');
    }

    const translatedText = response.data.responseData.translatedText;

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
    const msg = err.response?.data?.responseDetails || err.message;
    res.status(500).json({ message: `Translation failed: ${msg}` });
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
