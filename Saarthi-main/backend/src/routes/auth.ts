import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { signToken, requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, age, city } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    phone,
    age: age ? Number(age) : undefined,
    city,
  });

  const authUser = { id: String(user._id), name: user.name, email: user.email };
  return res.status(201).json({ token: signToken(authUser), user: authUser });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'No account found with this email. Please sign up first.' });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const authUser = { id: String(user._id), name: user.name, email: user.email };
  return res.json({ token: signToken(authUser), user: authUser });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthedRequest, res) => {
  return res.json({ user: req.user });
});

export default router;
