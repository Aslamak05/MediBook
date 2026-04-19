# Swift Clinic Pro 🏥

A comprehensive clinic management system built with modern web technologies. Manage appointments, doctors, prescriptions, and patient records efficiently.

**Live Demo**: Coming Soon (Deploy to Production)  
**GitHub**: https://github.com/Aslamak05/swift-clinic-pro

---

## ✨ Features

### Patient Features
- ✅ User registration and authentication
- ✅ Book appointments with available doctors
- ✅ View appointment history and status
- ✅ Cancel or reschedule appointments
- ✅ View prescriptions from doctors
- ✅ Receive appointment reminders (SMS + In-app)
- ✅ Upload avatar profile picture
- ✅ Dashboard with upcoming appointments

### Doctor Features
- ✅ Doctor profile management
- ✅ View assigned appointments
- ✅ Create and manage prescriptions
- ✅ Manage time slots and availability
- ✅ View patient details
- ✅ Upload medical certificates
- ✅ Track appointment history

### Admin Features
- ✅ User and doctor management
- ✅ Approve new doctor registrations
- ✅ View system metrics and analytics
- ✅ Appointment management
- ✅ System settings configuration
- ✅ View all users, doctors, appointments

### System Features
- ✅ JWT-based authentication
- ✅ MongoDB database with 7 models
- ✅ Atomic slot booking (prevents double-booking)
- ✅ Automated appointment reminders (1 day, 1 hour, 15 minutes)
- ✅ SMS notifications (Twilio integration)
- ✅ In-app notifications
- ✅ File upload support (avatars, certificates)
- ✅ CORS enabled for frontend/backend separation
- ✅ Error handling and validation
- ✅ Responsive UI with Tailwind CSS

---

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (HS256)
- **Password Hashing**: bcryptjs
- **Notifications**: Twilio SMS, In-app notifications
- **File Upload**: Multer
- **Job Scheduling**: node-cron
- **Environment**: Node.js v22+

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **API Client**: Axios
- **Form Handling**: React Hook Form

### Database Models
- **User**: Patient/Doctor/Admin accounts
- **Doctor**: Doctor profiles and details
- **Appointment**: Booking and scheduling
- **Slot**: Available time slots per doctor
- **Prescription**: Medical prescriptions
- **Notification**: System notifications
- **Settings**: System configuration

---

## 📋 Prerequisites

### Required
- **Node.js**: v22.0.0 or higher
- **MongoDB**: v6.0 or higher (local or MongoDB Atlas)
- **Git**: For version control
- **npm or yarn**: Package manager

### Optional
- **Twilio Account**: For SMS notifications (optional, system has SMS fallback)
- **Postman**: For API testing

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Aslamak05/swift-clinic-pro.git
cd swift-clinic-pro-main
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=4000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/medibook
JWT_SECRET=your-secret-key-here-min-32-characters
JWT_EXPIRES=7d
CORS_ORIGIN=http://localhost:8080
UPLOAD_DIR=./uploads
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=+15555555555
```

#### Frontend Setup
```bash
cd swift-clinic-pro-main
npm install
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGO_URL in .env)
```

### 4. Run Backend
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

### 5. Run Frontend (in new terminal)
```bash
cd swift-clinic-pro-main
npm run dev
# Frontend runs on http://localhost:8080
```

---

## 📱 Demo Accounts

Use these credentials to test the application:

### Patient Account
```
Email: patient@demo.com
Password: Demo@123
```

### Doctor Account
```
Email: doctor@demo.com
Password: Demo@123
```

### Admin Account
```
Email: admin@demo.com
Password: Demo@123
```

---

## 📁 Project Structure

```
swift-clinic-pro-main/
├── backend/                          # Express.js server
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── env.js              # Environment variables
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── doctorController.js
│   │   │   ├── adminController.js
│   │   │   └── ...
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Appointment.js
│   │   │   ├── Slot.js
│   │   │   ├── Prescription.js
│   │   │   ├── Notification.js
│   │   │   └── Settings.js
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Authentication, uploads
│   │   ├── services/               # External services (SMS, etc)
│   │   ├── jobs/                   # Scheduled tasks (reminders)
│   │   └── server.js              # Entry point
│   ├── package.json
│   └── .env.example
│
└── swift-clinic-pro-main/           # React frontend
    ├── src/
    │   ├── components/             # React components
    │   │   ├── ui/                # shadcn/ui components
    │   │   ├── AppHeader.tsx
    │   │   ├── AppointmentCard.tsx
    │   │   ├── BookingDialog.tsx
    │   │   └── ...
    │   ├── pages/                 # Page components
    │   │   ├── Index.tsx          # Home page
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── UserDashboard.tsx
    │   │   ├── DoctorDashboard.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   └── ...
    │   ├── lib/
    │   │   ├── api.ts             # API client
    │   │   ├── types.ts           # TypeScript types
    │   │   └── storage.ts         # Local storage helpers
    │   ├── contexts/              # React Context
    │   ├── hooks/                 # Custom hooks
    │   └── main.tsx              # Entry point
    ├── public/                    # Static files
    ├── package.json
    └── vite.config.ts
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
```

### Appointments
```
GET    /api/appointments           # Get user's appointments
POST   /api/appointments           # Book appointment
PUT    /api/appointments/:id       # Update appointment
DELETE /api/appointments/:id       # Cancel appointment
POST   /api/appointments/:id/reschedule  # Reschedule
```

### Doctors
```
GET    /api/doctors                # List all doctors
GET    /api/doctors/:id            # Get doctor details
PUT    /api/doctors/:id            # Update doctor profile
POST   /api/doctors/:id/slots      # Get available slots
```

### Prescriptions
```
GET    /api/prescriptions          # Get user's prescriptions
POST   /api/prescriptions          # Create prescription
PUT    /api/prescriptions/:id      # Update prescription
```

### Admin
```
GET    /api/admin/metrics          # System metrics
GET    /api/admin/users            # List all users
GET    /api/admin/doctors          # List all doctors
PUT    /api/admin/doctors/:id/approve  # Approve doctor
```

---

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['patient', 'doctor', 'admin'],
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model
```javascript
{
  user: ObjectId (ref: User),
  specialization: String,
  experience: Number,
  certifications: [String],
  isApproved: Boolean,
  rating: Number,
  createdAt: Date
}
```

### Appointment Model
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  slot: ObjectId (ref: Slot),
  status: Enum ['scheduled', 'completed', 'cancelled'],
  notes: String,
  createdAt: Date
}
```

### Slot Model
```javascript
{
  doctor: ObjectId (ref: Doctor),
  date: Date,
  time: String,
  isBooked: Boolean,
  createdAt: Date
}
```

---

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | 32+ character random string |
| `JWT_EXPIRES` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:8080` |
| `UPLOAD_DIR` | Directory for file uploads | `./uploads` |
| `TWILIO_ACCOUNT_SID` | Twilio account ID | (optional) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | (optional) |
| `TWILIO_FROM` | Twilio phone number | (optional) |

### Frontend (.env.production)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend-url.com/api` |

---

## 🚢 Deployment

### Quick Deployment (Recommended)

**Backend**: Railway.app  
**Frontend**: Vercel  
**Database**: MongoDB Atlas  

**Estimated Time**: ~30 minutes  
**Cost**: $6-15/month (free tier available)

### Deployment Guide

See `DEPLOYMENT_QUICK_CHECKLIST.md` for:
- Step-by-step deployment instructions
- Environment setup
- Verification tests
- Troubleshooting

### Deploy Locally with Docker

```bash
docker-compose up
```

---

## 🧪 Testing

### Run Frontend Tests
```bash
cd swift-clinic-pro-main
npm run test
```

### Test API Endpoints
```bash
# Using Postman or similar tool
# Import endpoints from API documentation
```

### Manual Testing
1. Start both servers
2. Open http://localhost:8080
3. Login with demo accounts
4. Test features (booking, cancellation, etc)

---

## 📊 Features Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | JWT with 7-day expiry |
| Patient Appointments | ✅ Complete | Full CRUD operations |
| Doctor Management | ✅ Complete | Profile, slots, prescriptions |
| Slot Booking | ✅ Complete | Atomic, prevents double-booking |
| Prescriptions | ✅ Complete | Create, view, manage |
| SMS Notifications | ✅ Complete | Twilio integration |
| In-app Notifications | ✅ Complete | Real-time system |
| Admin Dashboard | ✅ Complete | Full metrics and management |
| File Uploads | ✅ Complete | Avatars and certificates |
| Reminders | ✅ Complete | 1 day, 1 hour, 15 min before |
| Email Notifications | ❌ Removed | SMS-only system |

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Environment variables for sensitive data
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Error handling without exposing internals

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
# Check MONGO_URL in .env
# Check if port 4000 is available
lsof -i :4000  # See what's using port 4000
```

### Frontend Won't Connect to Backend
```bash
# Check CORS_ORIGIN in backend .env
# Should match frontend URL (http://localhost:8080)
# Check if backend is running (http://localhost:4000)
```

### MongoDB Connection Error
```bash
# Check connection string
# Check network access (MongoDB Atlas)
# Check username/password
# Test connection: mongodb+srv://user:pass@cluster.mongodb.net/test
```

### Appointment Booking Fails
```bash
# Check if doctor exists and is approved
# Check if slots exist for that date
# Check if patient is logged in
# Check browser console for error details
```

---

## 📞 Support & Contact

- **Issues**: Create an issue on GitHub
- **Email**: aslam@example.com
- **Documentation**: See project README files

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Roadmap

### Future Features
- [ ] Video consultation integration
- [ ] AI-powered symptom checker
- [ ] Mobile app (React Native)
- [ ] Insurance integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Real-time chat system

---

## 👥 Contributors

- **Aslam** - Project Lead & Full Stack Developer

---

## 📦 Dependencies

### Backend
- express@4.18.2
- mongoose@7.0.0
- bcryptjs@2.4.3
- jsonwebtoken@9.0.0
- multer@1.4.5
- node-cron@3.0.2
- dotenv@16.0.3

### Frontend
- react@18.2.0
- typescript@5.0+
- tailwindcss@3.3.0
- shadcn/ui (latest)
- vite@5.4.0
- axios@1.6.0

---

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- MongoDB for reliable database
- Vercel for frontend hosting
- Railway for backend hosting

---

**Happy Coding! 🚀**

For questions or issues, please open an issue on GitHub.

---

*Last Updated: April 2026*  
*Status: Production Ready ✅*
