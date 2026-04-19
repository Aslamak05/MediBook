import Slot from '../models/Slot.js';
import Doctor from '../models/Doctor.js';
import { httpError } from '../middleware/error.js';

export async function listSlots(req, res, next) {
  try {
    const { doctorId } = req.params;
    const slots = await Slot.find({
      doctor: doctorId,
      isBooked: false,
      startsAt: { $gte: new Date() },
    }).sort({ startsAt: 1 });
    res.json(slots);
  } catch (e) {
    next(e);
  }
}

export async function getMySlots(req, res, next) {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) throw httpError(404, 'Doctor not found');

    const slots = await Slot.find({ doctor: doctor._id }).sort({ startsAt: 1 });
    res.json(slots);
  } catch (e) {
    next(e);
  }
}

export async function createSlots(req, res, next) {
  try {
    const { slots } = req.body;
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) throw httpError(404, 'Doctor not found');

    const now = new Date();
    const createdSlots = [];

    for (const slot of slots) {
      const { startsAt, endsAt } = slot;

      // Validate times
      if (new Date(startsAt) < now) {
        throw httpError(400, 'Cannot create slots in the past');
      }
      if (new Date(endsAt) <= new Date(startsAt)) {
        throw httpError(400, 'End time must be after start time');
      }

      // Check for overlaps
      const overlap = await Slot.findOne({
        doctor: doctor._id,
        $or: [
          { startsAt: { $lt: endsAt, $gte: startsAt } },
          { endsAt: { $gt: startsAt, $lte: endsAt } },
        ],
      });

      if (overlap) {
        throw httpError(400, 'Overlapping slots detected');
      }

      const newSlot = await Slot.create({
        doctor: doctor._id,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
      });
      createdSlots.push(newSlot);
    }

    res.status(201).json(createdSlots);
  } catch (e) {
    next(e);
  }
}

export async function deleteSlot(req, res, next) {
  try {
    const { id } = req.params;
    const slot = await Slot.findById(id);
    if (!slot) throw httpError(404, 'Slot not found');

    if (slot.isBooked) {
      throw httpError(400, 'Cannot delete booked slot');
    }

    await Slot.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
