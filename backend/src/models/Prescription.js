import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dose: String,
    frequency: String,
    duration: String,
  }],
  notes: String,
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
