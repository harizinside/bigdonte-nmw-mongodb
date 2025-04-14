import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tidak ditemukan di .env.local");
}

// Caching koneksi untuk menghindari multiple connections
let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        return mongoose.connection;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
