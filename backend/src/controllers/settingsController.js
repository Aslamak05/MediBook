import Settings from '../models/Settings.js';
import { httpError } from '../middleware/error.js';

export async function getSettings(req, res, next) {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (e) {
    next(e);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const { brandName, brandTagline, commissionPercent, reschedulePolicyHours } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (brandName !== undefined) settings.brandName = brandName;
    if (brandTagline !== undefined) settings.brandTagline = brandTagline;
    if (commissionPercent !== undefined) settings.commissionPercent = commissionPercent;
    if (reschedulePolicyHours !== undefined) settings.reschedulePolicyHours = reschedulePolicyHours;

    if (req.file) {
      settings.brandLogoUrl = `/uploads/${req.file.filename}`;
    }

    await settings.save();
    res.json(settings);
  } catch (e) {
    next(e);
  }
}
