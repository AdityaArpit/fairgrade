import {
  getUserById,
  loginUser,
  registerUser
} from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to register user'
    });
  }
}

export async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to login'
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to fetch current user'
    });
  }
}
