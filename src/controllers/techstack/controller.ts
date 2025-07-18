import Multer from '../../modules/Multer';
import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import routes from '../../routes/v1';
import techStackService from './service';
import {techStackSchema} from './schema';
import authorization from '../../common/middleware/Authorization';

const uploadFile = Multer.useMulter(
  Multer.getDefaultUploadFileOptions({
    dest: 'public/uploads',
    onlyImages: true,
    maxSizeUpload: 2 * 1000 * 1000,
  })
).single('icon');

// const setFileToBody = asyncHandler(async function setFileToBody(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   req.body.file =
//     req.files &&
//     (req.files as {[fieldname: string]: Express.Multer.File[]}).file;
//   next();
// });

routes.post(
  '/techstack',
  authorization,
  uploadFile,
  // setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const icon = req.file;

    const files: {[fieldname: string]: Express.Multer.File[]} = icon
      ? {icon: [icon]}
      : {};

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await techStackService.createTechStack(
      req.userLogin.id,
      {
        ...formData,
        icon:
          savedFilePaths.find((e) => e.fieldName === 'icon')?.paths[0] ?? '',
      }
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/techstack',
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await techStackService.getAllTechStack();

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/techstack/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await techStackService.getTechStackById(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.delete(
  '/techstack/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await techStackService.deleteTechStack(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.put(
  '/techstack/:id',
  authorization,
  uploadFile,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const icon = req.file;

    const files: {[fieldname: string]: Express.Multer.File[]} = icon
      ? {icon: [icon]}
      : {};

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await techStackService.updateTechStack(
      req.params.id,
      {
        ...formData,
        icon: savedFilePaths.find((e) => e.fieldName == 'icon')?.paths[0],
      }
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);
