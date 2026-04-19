import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Initialize transporter
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // If email credentials are provided, use them
  if (env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: parseInt(env.EMAIL_PORT),
      secure: env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  } else if (env.EMAIL_SERVICE && env.EMAIL_USER && env.EMAIL_PASS) {
    // Gmail or other services
    transporter = nodemailer.createTransport({
      service: env.EMAIL_SERVICE,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  } else {
    // Mock transporter for development
    console.log('[Email Mock] Email credentials not configured. Using mock transporter.');
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('[Email Mock] Would send:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html.substring(0, 100) + '...',
        });
        return { messageId: 'mock-' + Date.now() };
      },
    };
  }

  return transporter;
}

// Email templates
const emailTemplates = {
  bookingConfirmation: (userName, doctorName, appointmentTime, fee) => ({
    subject: 'Appointment Booking Confirmed - MediBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a7490;">Appointment Booking Confirmed</h2>
        <p>Dear ${userName},</p>
        <p>Your appointment has been successfully booked with <strong>${doctorName}</strong>.</p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Appointment Details:</strong></p>
          <p><strong>Date & Time:</strong> ${appointmentTime}</p>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Fee:</strong> ₹${fee}</p>
        </div>

        <p>Please arrive 10 minutes before your appointment time.</p>
        <p>You will receive reminders before your appointment.</p>
        
        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),

  appointmentReminder: (userName, doctorName, appointmentTime, reminderType) => ({
    subject: `Reminder: Your appointment with ${doctorName} - MediBook`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a7490;">Appointment Reminder</h2>
        <p>Dear ${userName},</p>
        <p>This is your <strong>${reminderType}</strong> reminder for your appointment.</p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Date & Time:</strong> ${appointmentTime}</p>
        </div>

        <p>Please make sure you are on time for your appointment.</p>
        
        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),

  prescriptionReady: (userName, doctorName, diagnosis) => ({
    subject: 'Your Prescription is Ready - MediBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a7490;">Prescription Ready</h2>
        <p>Dear ${userName},</p>
        <p>Your prescription from Dr. <strong>${doctorName}</strong> is now ready.</p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Diagnosis:</strong> ${diagnosis || 'See prescription details in the app'}</p>
        </div>

        <p>Please log in to your MediBook account to view your complete prescription with medicines and dosage.</p>
        
        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),

  appointmentCancellation: (userName, doctorName, appointmentTime) => ({
    subject: 'Appointment Cancelled - MediBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Appointment Cancelled</h2>
        <p>Dear ${userName},</p>
        <p>Your appointment has been cancelled.</p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Appointment Date & Time:</strong> ${appointmentTime}</p>
        </div>

        <p>You can book another appointment at any time from the MediBook app.</p>
        
        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),

  welcomeEmail: (userName, role) => ({
    subject: 'Welcome to MediBook - Doctor Appointment System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a7490;">Welcome to MediBook!</h2>
        <p>Dear ${userName},</p>
        <p>Welcome to MediBook, your personal doctor appointment system.</p>
        
        <p>You have registered as a <strong>${role === 'doctor' ? 'Doctor' : role === 'admin' ? 'Administrator' : 'Patient'}</strong>.</p>

        ${
          role === 'doctor'
            ? `
          <p><strong>Next Steps for Doctors:</strong></p>
          <ul>
            <li>Complete your profile with qualifications and experience</li>
            <li>Wait for admin approval before patients can book your slots</li>
            <li>Create availability slots once approved</li>
            <li>Manage appointments and write prescriptions</li>
          </ul>
        `
            : role === 'admin'
            ? `
          <p><strong>Next Steps for Admin:</strong></p>
          <ul>
            <li>Access the admin dashboard</li>
            <li>Review and approve pending doctor registrations</li>
            <li>Monitor platform metrics and appointments</li>
            <li>Configure app settings (commission, branding, policies)</li>
          </ul>
        `
            : `
          <p><strong>Next Steps for Patients:</strong></p>
          <ul>
            <li>Browse available doctors</li>
            <li>Check doctor profiles and specializations</li>
            <li>Book appointments at your convenience</li>
            <li>Receive prescriptions after appointments</li>
          </ul>
        `
        }

        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),

  doctorApprovalNotification: (doctorName) => ({
    subject: 'Your Doctor Profile has been Approved - MediBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Profile Approved!</h2>
        <p>Dear Dr. ${doctorName},</p>
        <p>Congratulations! Your doctor profile has been approved by the admin.</p>
        
        <p>You can now:</p>
        <ul>
          <li>Create availability slots</li>
          <li>Receive appointment bookings from patients</li>
          <li>Manage your appointments</li>
          <li>Write prescriptions for completed appointments</li>
        </ul>

        <p>Log in to your MediBook account to get started.</p>
        
        <p style="margin-top: 30px; color: #666;">
          Best regards,<br>
          MediBook Team
        </p>
      </div>
    `,
  }),
};

export async function send(recipientEmail, templateName, templateData = {}) {
  try {
    const mailTransporter = getTransporter();
    const template = emailTemplates[templateName];

    if (!template) {
      console.warn(`Email template not found: ${templateName}`);
      return null;
    }

    const emailContent = template(...templateData);
    const mailOptions = {
      from: env.EMAIL_FROM || env.EMAIL_USER || 'noreply@medibook.com',
      to: recipientEmail,
      ...emailContent,
    };

    const result = await mailTransporter.sendMail(mailOptions);
    console.log(`[Email Sent] To: ${recipientEmail}, Subject: ${emailContent.subject}`);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    return null;
  }
}

export async function sendToMany(recipientEmails, templateName, templateData = {}) {
  try {
    const results = [];
    for (const email of recipientEmails) {
      const result = await send(email, templateName, templateData);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error('Failed to send emails:', error.message);
    return [];
  }
}

// Test function for development
export async function testEmail(testEmail) {
  try {
    console.log('[Email Test] Sending test email to:', testEmail);
    const result = await send(testEmail, 'welcomeEmail', ['Test User', 'user']);
    console.log('[Email Test] Result:', result);
    return result;
  } catch (error) {
    console.error('[Email Test] Failed:', error.message);
    throw error;
  }
}
