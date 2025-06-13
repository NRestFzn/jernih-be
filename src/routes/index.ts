import express, {Request, Response, Router} from 'express';
import v1Routes from './v1';
const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
  res.send('Welcome');
});

routes.use('/v1', v1Routes);
export default routes;
