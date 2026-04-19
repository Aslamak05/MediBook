import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  brandName: { type: String, default: 'MediBook' },
  brandTagline: { type: String, default: 'Care, on schedule.' },
  brandLogoUrl: String,
  commissionPercent: { type: Number, default: 10, min: 0, max: 100 },
  reschedulePolicyHours: { type: Number, default: 24, min: 0 },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
