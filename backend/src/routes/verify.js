import express from 'express';
import User from '../models/User.js';
import TrustEvent from '../models/TrustEvent.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role === 'customer' && req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findOne({ userId }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const latestEvent = await TrustEvent.findOne({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      verification: {
        userId:        user.userId,
        name:          user.name,
        email:         user.email,
        kycVerified:   user.kycVerified,
        mfaEnabled:    user.mfaEnabled,
        isActive:      user.isActive,
        isBlocked:     user.isBlocked,
        role:          user.role,
        accountType:   user.accountType,
        accountAgeDays: user.accountAgeDays,
        lastRiskScore: user.lastRiskScore,
        lastDecision:  user.lastDecision,
        lastLoginAt:   user.lastLoginAt,
        latestEvent: latestEvent
          ? {
              severity:    latestEvent.severity,
              decision:    latestEvent.decision,
              riskScore:   latestEvent.riskScore,
              incidentId:  latestEvent.incidentId,
              timestamp:   latestEvent.createdAt,
            }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:userId', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { kycVerified, mfaEnabled, isActive, isBlocked } = req.body;

    const update = {};
    if (kycVerified !== undefined) update.kycVerified = kycVerified;
    if (mfaEnabled  !== undefined) update.mfaEnabled  = mfaEnabled;
    if (isActive    !== undefined) update.isActive    = isActive;
    if (isBlocked   !== undefined) update.isBlocked   = isBlocked;

    const user = await User.findOneAndUpdate({ userId }, update, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User verification status updated',
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
