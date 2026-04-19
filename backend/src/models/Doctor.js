import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true, index: true },
  qualifications: { type: String, required: true },
  experienceYears: { type: Number, default: 0, min: 0 },
  bio: String,
  fee: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  certificateUrl: String,
  certificateName: String,
  rating: { type: Number, min: 0, max: 5 },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
