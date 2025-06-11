import app from '@/server';
import {Request, Response} from 'express';

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

export default app;
