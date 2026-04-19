import express from 'express';
import {
  listSlots,
  getMySlots,
  createSlots,
  deleteSlot,
} from '../controllers/slotController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/doctor/:doctorId', listSlots);
router.get('/me', requireAuth, requireRole('doctor'), getMySlots);
router.post('/', requireAuth, requireRole('doctor'), createSlots);
router.delete('/:id', requireAuth, requireRole('doctor'), deleteSlot);

export default router;
