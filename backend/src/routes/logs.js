import express from 'express';
import trust from 'trust-ai';
import TrustEvent from '../models/TrustEvent.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const { severity, decision, eventType, limit = 100, page = 1 } = req.query;

    const filter = {};
    if (severity)  filter.severity  = severity;
    if (decision)  filter.decision  = decision;
    if (eventType) filter.eventType = eventType;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await TrustEvent.countDocuments(filter);
    const events = await TrustEvent.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page:    Number(page),
      pages:   Math.ceil(total / Number(limit)),
      events,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', protect, restrictTo('admin', 'analyst'), async (req, res) => {
  try {
    const packageStats  = trust.provideLog(undefined, { limit: 1000 });
    const mongoStats    = await TrustEvent.aggregate([
      {
        $facet: {
          bySeverity: [{ $group: { _id: '$severity', count: { $sum: 1 } } }],
          byDecision: [{ $group: { _id: '$decision', count: { $sum: 1 } } }],
          avgRisk:    [{ $group: { _id: null, avg: { $avg: '$riskScore' } } }],
          total:      [{ $count: 'count' }],
        },
      },
    ]);

    const stats = mongoStats[0];

    res.json({
      success: true,
      stats: {
        total:       stats.total[0]?.count || 0,
        avgRiskScore: Math.round(stats.avgRisk[0]?.avg || 0),
        bySeverity:  Object.fromEntries(stats.bySeverity.map(s => [s._id, s.count])),
        byDecision:  Object.fromEntries(stats.byDecision.map(d => [d._id, d.count])),
        packageLogs: packageStats.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { severity, eventType, limit = 50, since } = req.query;

    if (req.user.role === 'customer' && req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const packageLogs = trust.provideLog(userId, {
      severity,
      eventType,
      limit:   Number(limit),
      since:   since ? new Date(since) : undefined,
    });

    const filter = { userId };
    if (severity)  filter.severity  = severity;
    if (eventType) filter.eventType = eventType;
    if (since)     filter.createdAt = { $gte: new Date(since) };

    const mongoLogs = await TrustEvent.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success:     true,
      userId,
      packageLogs,
      mongoLogs,
      total:       mongoLogs.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
