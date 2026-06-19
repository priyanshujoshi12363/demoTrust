import express from 'express';
import trust from 'trust-ai';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

let _initialized  = false;
let _currentModel = null;

router.post('/initialize', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { apiKey, model } = req.body;

    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'apiKey is required' });
    }

    await trust.AI(apiKey, { model: model || 'minimax-m3' });

    _initialized  = true;
    _currentModel = model || 'minimax-m3';

    res.json({
      success: true,
      message: 'TrustAI initialized successfully',
      model:   _currentModel,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/status', protect, restrictTo('admin', 'analyst'), (req, res) => {
  const memStats = _initialized ? trust.memory.stats() : null;

  res.json({
    success:     true,
    initialized: _initialized,
    model:       _currentModel,
    memory:      memStats,
  });
});

router.get('/memory', protect, restrictTo('admin', 'analyst'), (req, res) => {
  try {
    const stats = trust.memory.stats();
    res.json({ success: true, memory: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
