import express from 'express';
import trust from 'trust-ai';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/customer', protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const result = await trust.chatbot.chat(message, req.user.userId);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/analyst', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'question is required' });
    }

    const result = await trust.dashboard.query(question, { userId });

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
