import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  startsAt: { type: Date, required: true, index: true },
  endsAt: { type: Date, required: true },
  isBooked: { type: Boolean, default: false, index: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
}, { timestamps: true });

// Prevent double-booking at the database level
slotSchema.index({ doctor: 1, startsAt: 1 }, { unique: true });

export default mongoose.model('Slot', slotSchema);
