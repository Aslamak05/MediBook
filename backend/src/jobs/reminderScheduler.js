import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import * as notificationService from '../services/notificationService.js';
import * as smsService from '../services/smsService.js';
import User from '../models/User.js';

export function startReminderScheduler() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = Date.now();
      const windows = [
        { key: 'd1', ms: 24 * 60 * 60 * 1000, label: '1 day' },
        { key: 'h1', ms: 60 * 60 * 1000, label: '1 hour' },
        { key: 'm15', ms: 15 * 60 * 1000, label: '15 minutes' },
      ];

      for (const w of windows) {
        const target = new Date(now + w.ms);
        const lo = new Date(target.getTime() - 30_000); // ±30s window
        const hi = new Date(target.getTime() + 30_000);

        const due = await Appointment.find({
          status: { $in: ['booked', 'confirmed', 'rescheduled'] },
          startsAt: { $gte: lo, $lte: hi },
          [`remindersSent.${w.key}`]: { $ne: true },
        }).populate('user').populate({
          path: 'doctor',
          populate: { path: 'user' }
        });

        for (const appt of due) {
          const reminderLabel = w.label === '1 day' ? '1 day' : w.label === '1 hour' ? '1 hour' : '15 minutes';

          // Send in-app notification
          await notificationService.send(
            appt.user._id,
            'Appointment reminder',
            `Your appointment with Dr. ${appt.doctor.user.name} is in ${reminderLabel}`
          );

          // Send SMS if phone exists
          if (appt.user.phone) {
            await smsService.send(
              appt.user.phone,
              `Reminder: Your appointment with Dr. ${appt.doctor.user.name} is in ${reminderLabel}`
            );
          }

          // Mark reminder as sent
          appt.remindersSent[w.key] = true;
          await appt.save();
        }
      }
    } catch (error) {
      console.error('Reminder scheduler error:', error.message);
    }
  });

  console.log('✓ Reminder scheduler started');
}
