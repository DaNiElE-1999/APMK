import express from 'express';
import 'dotenv/config';
import { connectDB } from './database/connection';
import middleware from './middleware';
import routes from './routes';

const app  = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(middleware);
app.use('/api', routes);

async function start(): Promise<void> {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  } catch (err) {
    console.error('Startup failure: ', err);
    process.exit(1);
  }
}

start();
