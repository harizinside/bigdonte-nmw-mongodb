import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongoose) => {
      console.log("✅ MongoDB connected successfully!");
      return mongoose;
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
