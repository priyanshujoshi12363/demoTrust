import mongoose from 'mongoose';

const trustEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  incidentId: {
    type: String,
    default: null,
  },
  eventType: {
    type: String,
    enum: ['LOGIN', 'TRANSACTION', 'PROFILE_UPDATE', 'PASSWORD_RESET', 'LOGOUT'],
    required: true,
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  trustScore: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
  },
  decision: {
    type: String,
    enum: ['ALLOW', 'CHALLENGE', 'REVIEW', 'BLOCK'],
    required: true,
  },
  reasons: [String],
  explanation: String,
  recommendations: [String],
  device: {
    deviceId: String,
    os: String,
    browser: String,
    deviceType: String,
    isNewDevice: Boolean,
  },
  location: {
    city: String,
    country: String,
    ipAddress: String,
    latitude: Number,
    longitude: Number,
  },
  authentication: {
    method: String,
    failedLogins: Number,
    mfaEnabled: Boolean,
    otpPassed: Boolean,
  },
  channel: {
    type: String,
    enum: ['MOBILE_APP', 'WEB', 'ATM', 'BRANCH', 'API'],
  },
}, { timestamps: true });

trustEventSchema.index({ severity: 1 });
trustEventSchema.index({ decision: 1 });
trustEventSchema.index({ createdAt: -1 });

export default mongoose.model('TrustEvent', trustEventSchema);
