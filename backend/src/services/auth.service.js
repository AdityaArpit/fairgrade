import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

const VALID_ROLES = new Set(['teacher', 'student']);

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
    createdAt: user.createdAt
  };
}

function signToken(user) {
  if (!env.jwtSecret) {
    throw createHttpError(500, 'JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role.toLowerCase()
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function validateRegistrationInput({ name, email, password, role }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(role);

  if (!String(name || '').trim()) {
    throw createHttpError(400, 'Name is required');
  }

  if (!normalizedEmail) {
    throw createHttpError(400, 'Email is required');
  }

  if (!String(password || '')) {
    throw createHttpError(400, 'Password is required');
  }

  if (String(password).length < 6) {
    throw createHttpError(400, 'Password must be at least 6 characters');
  }

  if (!VALID_ROLES.has(normalizedRole)) {
    throw createHttpError(400, 'Role must be teacher or student');
  }

  return {
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
    role: normalizedRole.toUpperCase()
  };
}

function validateLoginInput({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw createHttpError(400, 'Email is required');
  }

  if (!String(password || '')) {
    throw createHttpError(400, 'Password is required');
  }

  return {
    email: normalizedEmail,
    password: String(password)
  };
}

export async function registerUser(input) {
  const userInput = validateRegistrationInput(input);

  const existingUser = await prisma.user.findUnique({
    where: { email: userInput.email }
  });

  if (existingUser) {
    throw createHttpError(409, 'Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(
    userInput.password,
    env.bcryptSaltRounds
  );

  let user;

  try {
    user = await prisma.user.create({
      data: {
        name: userInput.name,
        email: userInput.email,
        password: hashedPassword,
        role: userInput.role
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw createHttpError(409, 'Email is already registered');
    }

    throw error;
  }

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}

export async function loginUser(input) {
  const loginInput = validateLoginInput(input);

  const user = await prisma.user.findUnique({
    where: { email: loginInput.email }
  });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(loginInput.password, user.password);

  if (!passwordMatches) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return toPublicUser(user);
}
