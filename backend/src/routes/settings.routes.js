import express from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/settingsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getSettings);
router.patch('/', requireAuth, requireRole('admin'), upload.single('brandLogo'), updateSettings);

export default router;
