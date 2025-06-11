import express, {Request, Response, type Express} from 'express';
import {msg} from '@/api/test';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send(msg);
});

export default app;
