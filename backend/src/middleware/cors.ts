import cors from 'cors';

export const corsAllWithCreds = cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
});
