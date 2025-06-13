import {Request, Response} from 'express';
import router from 'router/v1';
import authService from './service';

router.post('/auth/signin', async (req: Request, res: Response) => {
  const formData = req.body;

  const serviceResponse = await authService.signIn(formData);

  res.status(serviceResponse.statusCode).json(serviceResponse);
});

router.post('/auth/signup', async (req: Request, res: Response) => {
  const formData = req.body;

  const serviceResponse = await authService.signUp(formData);

  res.status(serviceResponse.statusCode).json(serviceResponse);
});
