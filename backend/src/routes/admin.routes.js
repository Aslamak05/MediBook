import express from 'express';
import {
  getMetrics,
  listUsers,
  listDoctors,
  approveDoctor,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', requireAuth, requireRole('admin'), getMetrics);
router.get('/users', requireAuth, requireRole('admin'), listUsers);
router.get('/doctors', requireAuth, requireRole('admin'), listDoctors);
router.patch('/doctors/:id/approve', requireAuth, requireRole('admin'), approveDoctor);

export default router;
