import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import routes from '../../routes/v1';
import experienceService from './service';
import authorization from '../../common/middleware/Authorization';

routes.post(
  '/experience',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const serviceResponse = await experienceService.createExperience(
      req.userLogin.id,
      formData
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/experience',
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await experienceService.getAllExperience();

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/experience/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await experienceService.getExperienceById(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.delete(
  '/experience/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await experienceService.deleteExperience(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.put(
  '/experience/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const serviceResponse = await experienceService.updateExperience(
      req.params.id,
      formData
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);
