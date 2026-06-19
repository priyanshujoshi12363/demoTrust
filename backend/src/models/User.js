import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['customer', 'analyst', 'admin'],
    default: 'customer',
  },
  accountType: {
    type: String,
    enum: ['SAVINGS', 'CURRENT', 'BUSINESS'],
    default: 'SAVINGS',
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  lastLoginAt: {
    type: Date,
  },
  lastLoginIp: {
    type: String,
  },
  lastLoginDevice: {
    type: String,
  },
  lastRiskScore: {
    type: Number,
    default: 0,
  },
  lastDecision: {
    type: String,
    enum: ['ALLOW', 'CHALLENGE', 'REVIEW', 'BLOCK'],
    default: 'ALLOW',
  },
}, { timestamps: true });

userSchema.virtual('accountAgeDays').get(function () {
  return Math.floor((Date.now() - new Date(this.createdAt).getTime()) / 86400000);
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', { virtuals: true });

export default mongoose.model('User', userSchema);
