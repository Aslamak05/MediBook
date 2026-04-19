import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, unique: true },
  startsAt: { type: Date, required: true, index: true },
  endsAt: { type: Date, required: true },
  doctorFee: { type: Number, required: true },
  commission: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  status: { type: String, enum: ['booked', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'], default: 'booked', index: true },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', default: null },
  remindersSent: { d1: Boolean, h1: Boolean, m15: Boolean },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
