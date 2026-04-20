import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;


// edi env file bata data paayena vane sedai fail hunxa instead of later on development
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}


/**
 * conn means actual connectio
 * promise means connection load huadi ca
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}


/**
 * next js mode le file dherai relod garxa to avoid multiple connection
 * meomory leaks
 * so cache lai global garyo vane problem solve vayo
 */
declare global {
  var mongoose: MongooseCache;
}


// check connection already  globally save vayo ki nai
let cached = global.mongoose;


// ya chai cahce xaina vane first time cache object banuni
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}


// ya chai actual connection ho jun aru thau ma ni use garna sakinxa
export async function connectDB() {
  if (cached.conn) {
    console.log('✅ Using cached database connection');
    return cached.conn;
  }


  /**
   * yo chai connection vairako xaina janauxa
   * bufferCommands: false, yo chai connection vako xaina vane command haru store garxa
   * maxPoolSize: 10, yo chai connection pool size ho
   * serverSelectionTimeoutMS: 5000, yo chai server selection timeout ho
   * socketTimeoutMS: 45000, yo chai socket timeout ho
   */
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('📡 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}