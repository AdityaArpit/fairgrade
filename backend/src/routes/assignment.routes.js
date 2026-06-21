import { Router } from 'express';
import {
  createAssignment,
  createRubric,
  getAssignmentById,
  getAssignments,
  getRubricsByAssignment
} from '../controllers/assignment.controller.js';
import {
  authenticateJwt,
  requireTeacher
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', requireTeacher, createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/:id/rubrics', requireTeacher, createRubric);
router.get('/:id/rubrics', getRubricsByAssignment);

export default router;
