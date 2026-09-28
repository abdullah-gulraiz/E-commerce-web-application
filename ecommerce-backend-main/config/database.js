const mongoose = require('mongoose');
require('dotenv').config();

// Serverless containers are reused between invocations, so cache the connection
// on the module (and on globalThis, which survives hot reloads) instead of
// opening a new one on every request.
let cached = globalThis.__mongooseCache;
if (!cached) {
  cached = globalThis.__mongooseCache = { conn: null, promise: null };
}

const DbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log('Database connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        // Clear the cached promise so the next request can retry.
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = DbConnect;
