import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user', index: true },
  avatarUrl: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
