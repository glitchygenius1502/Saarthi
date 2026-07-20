// Local development entry point. On Vercel the app is served via api/[...path].ts
// as a serverless function, so this listen() only runs locally.
import 'dotenv/config';
import app from './app';

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Saarthi API listening on http://localhost:${port}`);
});
