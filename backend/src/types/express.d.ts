import { MongoClient } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      /** Pooled Mongo client attached by mongoMiddleware */
      mongo: MongoClient;
    }
  }
}

// turn this file into an “external module” so the compiler keeps it
export {};