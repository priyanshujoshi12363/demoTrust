import express from 'express';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../models/User.js';
import TrustEvent from '../models/TrustEvent.js';
import trust from 'trust-ai';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, accountType, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const userId = `user_${nanoid(10)}`;
    const user = await User.create({ userId, name, email, password, phone, accountType, role });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id:          user._id,
        userId:      user.userId,
        name:        user.name,
        email:       user.email,
        role:        user.role,
        accountType: user.accountType,
        kycVerified: user.kycVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, device, location, behavior, metadata } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact support.' });
    }

    const trustContext = {
      identity: {
        userId:         user.userId,
        accountAgeDays: user.accountAgeDays,
        accountType:    user.accountType,
        kycVerified:    user.kycVerified,
      },
      device: device || {
        deviceId:    req.headers['user-agent']?.slice(0, 40) || 'unknown',
        os:          'Unknown',
        browser:     'Unknown',
        isNewDevice: false,
      },
      location: location || {
        ipAddress: req.ip || req.connection.remoteAddress,
        country:   'Unknown',
        city:      'Unknown',
      },
      authentication: {
        method:        'PASSWORD',
        failedLogins:  0,
        mfaEnabled:    user.mfaEnabled,
        otpPassed:     true,
        passwordReset: false,
      },
      behavior: behavior || {
        eventType: 'LOGIN',
        loginHour: new Date().getHours(),
      },
      metadata: metadata || {
        channel:   'WEB',
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
      },
    };

    const riskResult = await trust(trustContext);

    await TrustEvent.create({
      userId:          user.userId,
      incidentId:      riskResult.incidentId || null,
      eventType:       'LOGIN',
      riskScore:       riskResult.riskScore,
      trustScore:      riskResult.trustScore,
      severity:        riskResult.severity,
      decision:        riskResult.decision,
      reasons:         riskResult.reasons,
      explanation:     riskResult.explanation,
      recommendations: riskResult.recommendations,
      device:          trustContext.device,
      location:        trustContext.location,
      authentication:  trustContext.authentication,
      channel:         trustContext.metadata?.channel,
    });

    await User.findByIdAndUpdate(user._id, {
      lastLoginAt:     new Date(),
      lastLoginIp:     trustContext.location.ipAddress,
      lastLoginDevice: trustContext.device.deviceId,
      lastRiskScore:   riskResult.riskScore,
      lastDecision:    riskResult.decision,
    });

    if (riskResult.decision === 'BLOCK') {
      return res.status(403).json({
        success:    false,
        message:    'Login blocked due to high fraud risk',
        risk:       riskResult,
        incidentId: riskResult.incidentId,
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id:          user._id,
        userId:      user.userId,
        name:        user.name,
        email:       user.email,
        role:        user.role,
        kycVerified: user.kycVerified,
      },
      risk: riskResult,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
