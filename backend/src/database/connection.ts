import mongoose from 'mongoose';
import 'dotenv/config';

const mongoUri = process.env.CONN as string;
if (!mongoUri) throw new Error('CONN env var not set');

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('[Mongoose] Connected');
  } catch (err) {
    console.error('[Mongoose] Connection error', err);
    process.exit(1);
  }
};

export default mongoose;
