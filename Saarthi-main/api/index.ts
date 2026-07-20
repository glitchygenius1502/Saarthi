// Vercel serverless entry: all /api/* requests are rewritten here (see
// vercel.json) and handled by the Express app, which routes internally.
import app from '../backend/src/app';

export default app;
