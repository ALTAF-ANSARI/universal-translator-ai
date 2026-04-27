const express = require('express');
const History = require('../models/History');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/history — user's own history
router.get('/', protect, async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/history/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await History.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/history — clear all history
router.delete('/', protect, async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
