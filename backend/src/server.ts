import express, { Request, Response } from 'express';
import 'dotenv/config';

const app  = express();
const port = Number(process.env.PORT) || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});