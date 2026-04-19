import express from 'express';
import {
  createPrescription,
  getPrescription,
} from '../controllers/prescriptionController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('doctor'), createPrescription);
router.get('/appointment/:appointmentId', requireAuth, getPrescription);

export default router;
