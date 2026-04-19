import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import * as notificationService from '../services/notificationService.js';
import { httpError } from '../middleware/error.js';

export async function createPrescription(req, res, next) {
  try {
    const { appointmentId, diagnosis, medicines, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('user')
      .populate({
        path: 'doctor',
        populate: { path: 'user' }
      });
    if (!appointment) throw httpError(404, 'Appointment not found');

    const prescription = await Prescription.create({
      appointment: appointmentId,
      diagnosis,
      medicines,
      notes,
    });

    // Update appointment status to completed
    appointment.status = 'completed';
    appointment.prescription = prescription._id;
    await appointment.save();

    // Send prescription ready notification to patient
    await notificationService.send(
      appointment.user._id,
      'Prescription ready',
      `Your prescription from Dr. ${appointment.doctor.user.name} is ready`,
      'prescription'
    );

    res.status(201).json(prescription);
  } catch (e) {
    next(e);
  }
}

export async function getPrescription(req, res, next) {
  try {
    const { appointmentId } = req.params;
    const prescription = await Prescription.findOne({ appointment: appointmentId });
    if (!prescription) throw httpError(404, 'Prescription not found');
    res.json(prescription);
  } catch (e) {
    next(e);
  }
}
