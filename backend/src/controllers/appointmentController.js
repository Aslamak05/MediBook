import Appointment from '../models/Appointment.js';
import Slot from '../models/Slot.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import { computeFee } from '../services/feeService.js';
import * as notificationService from '../services/notificationService.js';
import { httpError } from '../middleware/error.js';

export async function book(req, res, next) {
  try {
    const { slotId } = req.body;

    // Atomic: lock the slot
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: false },
      { isBooked: true },
      { new: true }
    );

    if (!slot) {
      throw httpError(409, 'This slot was just booked');
    }

    // Get doctor
    const doctor = await Doctor.findById(slot.doctor).populate('user');
    if (!doctor || doctor.status !== 'approved') {
      slot.isBooked = false;
      await slot.save();
      throw httpError(400, 'Doctor unavailable');
    }

    // Compute fee
    const fee = await computeFee(doctor.fee);

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctor._id,
      slot: slot._id,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      ...fee,
      status: 'booked',
    });

    slot.appointment = appointment._id;
    await slot.save();

    // Get user details
    const user = await User.findById(req.user.id);

    // Notify user with in-app notification
    await notificationService.send(
      req.user.id,
      'Appointment booked',
      `with Dr. ${doctor.user.name}`,
      'booking'
    );

    // Notify doctor with in-app notification
    await notificationService.send(doctor.user._id, 'New appointment', `Patient ${user.name} just booked a slot.`);

    res.status(201).json(appointment);
  } catch (e) {
    next(e);
  }
}

export async function getUserAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('user', 'name email phone')
      .sort({ startsAt: -1 });
    res.json(appointments);
  } catch (e) {
    next(e);
  }
}

export async function getDoctorAppointments(req, res, next) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) throw httpError(404, 'Doctor not found');

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('user', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ startsAt: -1 });
    res.json(appointments);
  } catch (e) {
    next(e);
  }
}

export async function getAllAppointments(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ startsAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments();

    res.json({
      appointments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    next(e);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) throw httpError(404, 'Appointment not found');

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (e) {
    next(e);
  }
}

export async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) throw httpError(404, 'Appointment not found');

    // Check 24-hour rule
    const settings = await Settings.findOne();
    const hours = settings?.reschedulePolicyHours || 24;
    const timeTillAppt = (appointment.startsAt.getTime() - Date.now()) / (1000 * 60 * 60);

    if (timeTillAppt < hours) {
      throw httpError(409, `Cannot cancel within ${hours} hours of appointment`);
    }

    // Free the slot
    const slot = await Slot.findById(appointment.slot);
    if (slot) {
      slot.isBooked = false;
      slot.appointment = null;
      await slot.save();
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify
    const user = await User.findById(appointment.user);
    const doctor = await Doctor.findById(appointment.doctor).populate('user');

    // Send cancellation notification to user
    await notificationService.send(
      user._id,
      'Appointment cancelled',
      `Your appointment with Dr. ${doctor.user.name} has been cancelled.`,
      'cancellation'
    );

    // Send in-app notification to doctor
    await notificationService.send(doctor.user._id, 'Appointment cancelled', `Appointment with ${user.name} has been cancelled.`);

    res.json(appointment);
  } catch (e) {
    next(e);
  }
}

export async function reschedule(req, res, next) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) throw httpError(404, 'Appointment not found');

    // Check 24-hour rule
    const settings = await Settings.findOne();
    const hours = settings?.reschedulePolicyHours || 24;
    const timeTillAppt = (appointment.startsAt.getTime() - Date.now()) / (1000 * 60 * 60);

    if (timeTillAppt < hours) {
      throw httpError(409, `Cannot reschedule within ${hours} hours of appointment`);
    }

    // Find next available slot
    const nextSlot = await Slot.findOne({
      doctor: appointment.doctor,
      isBooked: false,
      startsAt: { $gt: new Date() },
    }).sort({ startsAt: 1 });

    if (!nextSlot) {
      throw httpError(409, 'No available slots to reschedule');
    }

    // Free old slot
    const oldSlot = await Slot.findById(appointment.slot);
    if (oldSlot) {
      oldSlot.isBooked = false;
      oldSlot.appointment = null;
      await oldSlot.save();
    }

    // Book new slot
    nextSlot.isBooked = true;
    nextSlot.appointment = appointment._id;
    await nextSlot.save();

    // Update appointment
    appointment.slot = nextSlot._id;
    appointment.startsAt = nextSlot.startsAt;
    appointment.endsAt = nextSlot.endsAt;
    appointment.status = 'rescheduled';
    await appointment.save();

    // Notify
    const user = await User.findById(appointment.user);
    const doctor = await Doctor.findById(appointment.doctor).populate('user');
    await notificationService.send(user._id, 'Appointment rescheduled', `Your appointment with Dr. ${doctor.user.name} has been rescheduled.`);
    await notificationService.send(doctor.user._id, 'Appointment rescheduled', `Appointment with ${user.name} has been rescheduled.`);

    res.json(appointment);
  } catch (e) {
    next(e);
  }
}
