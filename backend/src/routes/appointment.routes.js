import express from 'express';
import {
  book,
  getUserAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateStatus,
  cancel,
  reschedule,
} from '../controllers/appointmentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('user'), book);
router.get('/me', requireAuth, requireRole('user'), getUserAppointments);
router.get('/doctor', requireAuth, requireRole('doctor'), getDoctorAppointments);
router.get('/', requireAuth, requireRole('admin'), getAllAppointments);
router.patch('/:id/status', requireAuth, requireRole('doctor', 'admin'), updateStatus);
router.post('/:id/cancel', requireAuth, requireRole('user', 'doctor'), cancel);
router.post('/:id/reschedule', requireAuth, requireRole('user'), reschedule);

export default router;
