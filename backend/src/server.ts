import express, { Request, Response } from 'express';
import 'dotenv/config';
import middleware from "./middleware"

const app  = express();
const port = Number(process.env.PORT) || 3000;

app.use(middleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});