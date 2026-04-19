import express from 'express';
import {
  listDoctors,
  getDoctor,
  getDoctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', listDoctors);
router.get('/:id', getDoctor);
router.get('/me/profile', requireAuth, requireRole('doctor'), getDoctorProfile);
router.patch('/me/profile', requireAuth, requireRole('doctor'), upload.single('certificate'), updateDoctorProfile);

export default router;
