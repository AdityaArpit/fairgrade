import { Router } from 'express';
import {
  createEvaluation,
  getEvaluation
} from '../controllers/evaluation.controller.js';
import {
  authenticateJwt,
  requireTeacher
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.post('/:submissionId', requireTeacher, createEvaluation);
router.get('/:submissionId', getEvaluation);

export default router;
