import mongoose from 'mongoose';

// Cache the connection across serverless invocations (and hot reloads) so we
// don't open a new pool on every request.
interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { _mongoose?: Cache };
const cached: Cache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    cached.promise = mongoose.connect(uri, { dbName: 'saarthi' });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
