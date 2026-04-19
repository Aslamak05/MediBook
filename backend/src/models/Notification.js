import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: String,
  type: { type: String, enum: ['booking', 'reminder', 'completion', 'cancellation', 'prescription', 'system'], default: 'system' },
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
