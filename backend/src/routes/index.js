import { Router } from 'express';
import assignmentRoutes from './assignment.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'AI-Assisted Answer Evaluation System API'
  });
});

router.use('/auth', authRoutes);
router.use('/assignments', assignmentRoutes);

export default router;
