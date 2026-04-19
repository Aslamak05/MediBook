import Notification from '../models/Notification.js';
import { httpError } from '../middleware/error.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (e) {
    next(e);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) throw httpError(404, 'Notification not found');

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (e) {
    next(e);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
