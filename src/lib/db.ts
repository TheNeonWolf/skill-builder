import mongoose, { type Mongoose } from "mongoose";

const getMongoDbUri = (): string => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define MONGODB_URI in your .env.local file"
    );
  }

  return uri;
};

const MONGODB_URI = getMongoDbUri();

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalWithMongoose.mongoose ??
  (globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  });

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}