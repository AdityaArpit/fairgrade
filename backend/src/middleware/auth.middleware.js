import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  if (!env.jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET is not configured' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireTeacher(req, res, next) {
  if (String(req.user?.role || '').toLowerCase() !== 'teacher') {
    return res.status(403).json({ message: 'Teacher access is required' });
  }

  return next();
}

export function requireStudent(req, res, next) {
  if (String(req.user?.role || '').toLowerCase() !== 'student') {
    return res.status(403).json({ message: 'Student access is required' });
  }

  return next();
}
