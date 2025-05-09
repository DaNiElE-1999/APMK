// src/middlewares/mongo.ts
import type { RequestHandler } from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.CONN as string;
if (!uri) throw new Error('CONN env var not set');

let cachedClient: MongoClient | null = null;

export const mongoMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    if (!cachedClient) {
      // first request in this process → create & connect
      cachedClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await cachedClient.connect();
      await cachedClient.db('admin').command({ ping: 1 });
      console.log('[Mongo] Connected');
    }

    req.mongo = cachedClient;
    return next();
  } catch (err) {
    return next(err);
  }
};
