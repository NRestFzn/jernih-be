import Multer from '../../modules/Multer';
import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import routes from '../../routes/v1';
import projectService from './service';
import authorization from '../../common/middleware/Authorization';

const uploadFile = Multer.useMulter(
  Multer.getDefaultUploadFileOptions({
    dest: 'public/uploads',
    onlyImages: true,
    maxSizeUpload: 2,
  })
).single('imagePreview');

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
  '/project',
  authorization,
  uploadFile,
  // setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const imagePreview = req.file;

    const files: {[fieldname: string]: Express.Multer.File[]} = imagePreview
      ? {imagePreview: [imagePreview]}
      : {};

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await projectService.createProject(
      req.userLogin.id,
      {
        ...formData,
        techStacks: JSON.parse(formData.techStacks),
        imagePreview:
          savedFilePaths.find((e) => e.fieldName === 'imagePreview')
            ?.paths[0] ?? '',
      }
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/project',
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await projectService.getAllProject();

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/project/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await projectService.getProjectById(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.delete(
  '/project/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await projectService.deleteProject(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.put(
  '/project/:id',
  authorization,
  uploadFile,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const imagePreview = req.file;

    const files: {[fieldname: string]: Express.Multer.File[]} = imagePreview
      ? {imagePreview: [imagePreview]}
      : {};

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await projectService.updateProject(req.params.id, {
      ...formData,
      techStacks: JSON.parse(formData.techStacks),
      imagePreview: savedFilePaths.find((e) => e.fieldName == 'imagePreview')
        ?.paths[0],
    });

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);
