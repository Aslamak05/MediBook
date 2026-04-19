# MediBook Backend

Express + MongoDB backend for the MediBook clinic appointment system.

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env`** with your configuration (MongoDB URL, JWT secret, etc.)

4. **Ensure MongoDB is running**
   ```bash
   # Local: mongod
   # Or use MongoDB Atlas connection string in .env
   ```

## Development

```bash
npm run dev
```

The server will run on `http://localhost:4000` (or the PORT in .env)

## Production

```bash
npm start
```

## API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Doctors**: `GET /api/doctors`, `GET /api/doctors/:id`, `GET /api/doctors/me/profile`
- **Slots**: `GET /api/slots/doctor/:id`, `POST /api/slots`, `DELETE /api/slots/:id`
- **Appointments**: `POST /api/appointments`, `GET /api/appointments/me`, `POST /api/appointments/:id/cancel`
- **Prescriptions**: `POST /api/prescriptions`, `GET /api/prescriptions/appointment/:appointmentId`
- **Notifications**: `GET /api/notifications`, `PATCH /api/notifications/:id/read`
- **Settings**: `GET /api/settings`, `PATCH /api/settings`
- **Admin**: `GET /api/admin/metrics`, `GET /api/admin/doctors`, `PATCH /api/admin/doctors/:id/approve`

## Features

- ✅ JWT authentication
- ✅ Role-based access control (user, doctor, admin)
- ✅ Double-booking prevention (atomic slots)
- ✅ 24-hour cancellation policy
- ✅ Fee calculation & commission tracking
- ✅ Appointment reminders (cron-based: 1d, 1h, 15m)
- ✅ SMS notifications (Twilio)
- ✅ File uploads (certificates, logo)
- ✅ Doctor approval workflow
- ✅ Prescription management

## Database Models

- **User**: Patients, doctors, admins
- **Doctor**: 1-1 with User role='doctor'
- **Slot**: Available time slots per doctor
- **Appointment**: Bookings with fee tracking
- **Prescription**: Post-appointment diagnosis & medicines
- **Notification**: In-app notifications
- **Settings**: Platform configuration

## Edge Cases Handled

- ✅ Concurrent bookings on same slot → 409 conflict
- ✅ Deleting booked slots → rejected
- ✅ Cancelling within 24h → rejected
- ✅ Rescheduling when no slots available → 409
- ✅ Unapproved doctors excluded from public listing
- ✅ Cron restart idempotency via `remindersSent` flags
