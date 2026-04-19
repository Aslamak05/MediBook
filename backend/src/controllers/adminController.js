import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { httpError } from '../middleware/error.js';

export async function getMetrics(req, res, next) {
  try {
    const users = await User.countDocuments({ role: 'user' });
    const doctors = await Doctor.countDocuments({ status: 'approved' });
    const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
    const appointments = await Appointment.countDocuments();
    
    // Calculate revenue from completed appointments
    const revenue = await Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalFee' } } },
    ]);

    res.json({
      users,
      doctors,
      pendingDoctors,
      appointments,
      revenue: revenue[0]?.total || 0,
    });
  } catch (e) {
    next(e);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (e) {
    next(e);
  }
}

export async function listDoctors(req, res, next) {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (e) {
    next(e);
  }
}

export async function approveDoctor(req, res, next) {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const doctor = await Doctor.findById(id).populate('user');
    if (!doctor) throw httpError(404, 'Doctor not found');

    doctor.status = approved ? 'approved' : 'rejected';
    await doctor.save();

    res.json(doctor);
  } catch (e) {
    next(e);
  }
}
