import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { httpError } from '../middleware/error.js';

export async function listDoctors(req, res, next) {
  try {
    const { q, specialization } = req.query;
    const filter = { status: 'approved' };

    if (q) {
      filter.$or = [
        { specialization: { $regex: q, $options: 'i' } },
        { 'user.name': { $regex: q, $options: 'i' } },
      ];
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone avatarUrl')
      .select('-certificateUrl');

    res.json(doctors);
  } catch (e) {
    next(e);
  }
}

export async function getDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatarUrl');
    if (!doctor) throw httpError(404, 'Doctor not found');
    res.json(doctor);
  } catch (e) {
    next(e);
  }
}

export async function getDoctorProfile(req, res, next) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email phone avatarUrl');
    if (!doctor) throw httpError(404, 'Doctor profile not found');
    res.json(doctor);
  } catch (e) {
    next(e);
  }
}

export async function updateDoctorProfile(req, res, next) {
  try {
    const { bio, fee, qualifications, experienceYears } = req.body;
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) throw httpError(404, 'Doctor profile not found');

    if (bio !== undefined) doctor.bio = bio;
    if (fee !== undefined) doctor.fee = fee;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;

    // If certificate is updated, reset status to pending
    if (req.file) {
      doctor.certificateUrl = `/uploads/${req.file.filename}`;
      doctor.certificateName = req.file.originalname;
      doctor.status = 'pending';
    }

    await doctor.save();
    res.json(doctor);
  } catch (e) {
    next(e);
  }
}
