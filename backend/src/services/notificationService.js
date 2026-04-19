import Notification from '../models/Notification.js';

export async function send(userId, title, message, type = 'system') {
  try {
    // Save in-app notification
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
}

export async function sendToMany(userIds, title, message, type = 'system') {
  try {
    const User = (await import('../models/User.js')).default;

    // Save in-app notifications
    const notifications = await Notification.insertMany(
      userIds.map(userId => ({
        user: userId,
        title,
        message,
        type,
      }))
    );

    return notifications;
  } catch (error) {
    console.error('Failed to send notifications:', error.message);
  }
}
