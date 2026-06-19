import express from 'express';
import trust from 'trust-ai';
import TrustEvent from '../models/TrustEvent.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/evaluate', protect, async (req, res) => {
  try {
    const { device, location, authentication, behavior, transaction, metadata } = req.body;
    const user = req.user;

    if (!behavior?.eventType) {
      return res.status(400).json({ success: false, message: 'behavior.eventType is required' });
    }

    const context = {
      identity: {
        userId:         user.userId,
        accountAgeDays: user.accountAgeDays,
        accountType:    user.accountType,
        kycVerified:    user.kycVerified,
      },
      device: device || {
        deviceId:    req.headers['user-agent']?.slice(0, 40) || 'unknown',
        os:          'Unknown',
        isNewDevice: false,
      },
      location: location || {
        ipAddress: req.ip,
        country:   'Unknown',
        city:      'Unknown',
      },
      authentication: authentication || {
        method:       'PASSWORD',
        failedLogins:  0,
        mfaEnabled:   user.mfaEnabled,
        otpPassed:    true,
      },
      behavior,
      transaction,
      metadata: metadata || {
        channel:   'API',
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
      },
    };

    const result = await trust(context);

    await TrustEvent.create({
      userId:          user.userId,
      incidentId:      result.incidentId || null,
      eventType:       behavior.eventType,
      riskScore:       result.riskScore,
      trustScore:      result.trustScore,
      severity:        result.severity,
      decision:        result.decision,
      reasons:         result.reasons,
      explanation:     result.explanation,
      recommendations: result.recommendations,
      device:          context.device,
      location:        context.location,
      authentication:  context.authentication,
      channel:         context.metadata?.channel,
    });

    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
