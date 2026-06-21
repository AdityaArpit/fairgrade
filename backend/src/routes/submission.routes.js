import { Router } from 'express';
import {
  createSubmission,
  getMySubmissions,
  getSubmissionsForAssignment
} from '../controllers/submission.controller.js';
import {
  authenticateJwt,
  requireStudent,
  requireTeacher
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.post('/submissions', requireStudent, createSubmission);
router.get('/submissions', requireStudent, getMySubmissions);
router.get(
  '/assignments/:id/submissions',
  requireTeacher,
  getSubmissionsForAssignment
);

export default router;
