import twilio from 'twilio';
import { env } from '../config/env.js';

let client = null;

if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

export const send = async (to, body) => {
  try {
    if (!client) {
      console.log('[SMS Mock] To:', to, 'Body:', body);
      return { sid: 'mock-' + Date.now() };
    }
    return await client.messages.create({
      from: env.TWILIO_FROM,
      to,
      body,
    });
  } catch (error) {
    console.error('Failed to send SMS:', error.message);
  }
};
