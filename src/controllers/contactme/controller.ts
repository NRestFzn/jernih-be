import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import routes from '../../routes/v1';
import contactMeService from './service';
import authorization from '../../common/middleware/Authorization';

routes.post(
  '/contactme',
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const serviceResponse = await contactMeService.createContactMe(formData);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/contactme',
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await contactMeService.getAllContactMe();

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/contactme/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await contactMeService.getContactMeById(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.delete(
  '/contactme/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await contactMeService.deleteContactMe(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);
