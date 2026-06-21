import { Router } from 'express';
import {
  getCurrentUser,
  login,
  register
} from '../controllers/auth.controller.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJwt, getCurrentUser);

export default router;
