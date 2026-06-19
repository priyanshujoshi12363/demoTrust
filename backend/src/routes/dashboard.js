import express from 'express';
import trust from 'trust-ai';
import TrustEvent from '../models/TrustEvent.js';
import User from '../models/User.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const [userStats, eventStats, packageStats, recentIncidents] = await Promise.all([
      User.aggregate([
        {
          $facet: {
            total:    [{ $count: 'count' }],
            byRole:   [{ $group: { _id: '$role',        count: { $sum: 1 } } }],
            verified: [{ $match: { kycVerified: true }  }, { $count: 'count' }],
            blocked:  [{ $match: { isBlocked:   true }  }, { $count: 'count' }],
          },
        },
      ]),
      TrustEvent.aggregate([
        {
          $facet: {
            total:      [{ $count: 'count' }],
            bySeverity: [{ $group: { _id: '$severity', count: { $sum: 1 } } }],
            byDecision: [{ $group: { _id: '$decision', count: { $sum: 1 } } }],
            avgRisk:    [{ $group: { _id: null, avg: { $avg: '$riskScore' } } }],
            today: [
              { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
              { $count: 'count' },
            ],
          },
        },
      ]),
      trust.dashboard.getStats(),
      TrustEvent.find({ severity: { $in: ['HIGH', 'CRITICAL'] } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('userId incidentId severity decision riskScore reasons createdAt'),
    ]);

    const u = userStats[0];
    const e = eventStats[0];

    res.json({
      success: true,
      stats: {
        users: {
          total:    u.total[0]?.count    || 0,
          verified: u.verified[0]?.count || 0,
          blocked:  u.blocked[0]?.count  || 0,
          byRole:   Object.fromEntries(u.byRole.map(r => [r._id, r.count])),
        },
        events: {
          total:        e.total[0]?.count      || 0,
          today:        e.today[0]?.count       || 0,
          avgRiskScore: Math.round(e.avgRisk[0]?.avg || 0),
          bySeverity:   Object.fromEntries(e.bySeverity.map(s => [s._id, s.count])),
          byDecision:   Object.fromEntries(e.byDecision.map(d => [d._id, d.count])),
        },
        package:   packageStats,
        recentIncidents,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/query', protect, restrictTo('admin', 'analyst'), async (req, res) => {
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

router.get('/incidents', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const { severity = 'CRITICAL', limit = 20 } = req.query;

    const incidents = await TrustEvent.find({
      severity,
      incidentId: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, total: incidents.length, incidents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const { limit = 50, page = 1, isBlocked, kycVerified } = req.query;

    const filter = {};
    if (isBlocked   !== undefined) filter.isBlocked   = isBlocked   === 'true';
    if (kycVerified !== undefined) filter.kycVerified = kycVerified === 'true';

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page:    Number(page),
      pages:   Math.ceil(total / Number(limit)),
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
