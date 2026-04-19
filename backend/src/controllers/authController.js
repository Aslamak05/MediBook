import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { env } from '../config/env.js';
import { httpError } from '../middleware/error.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, phone, role, specialization, qualifications, experienceYears, fee, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw httpError(409, 'Email already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user',
    });

    // If doctor, create doctor profile
    if (role === 'doctor') {
      let certificateUrl = null;
      if (req.file) {
        certificateUrl = `/uploads/${req.file.filename}`;
      }

      await Doctor.create({
        user: user._id,
        specialization,
        qualifications,
        experienceYears: experienceYears || 0,
        bio,
        fee,
        certificateUrl,
        certificateName: req.file?.originalname,
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES,
    });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw httpError(401, 'Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw httpError(401, 'Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES,
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token,
    });
  } catch (e) {
    next(e);
  }
}

export async function logout(req, res, next) {
  try {
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, 'User not found');
    res.json(user);
  } catch (e) {
    next(e);
  }
}
