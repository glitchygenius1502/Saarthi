import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import shecareRoutes from './routes/shecare';
import gynoRoutes from './routes/gyno';

const app = express();

app.use(express.json());
app.use(cors());

// Ensure the DB is connected (cached) before handling any /api route.
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'saarthi-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/shecare', shecareRoutes);
app.use('/api/gyno', gynoRoutes);

// Fallback for unknown API routes.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[api error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
