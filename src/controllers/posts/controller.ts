import Multer from '../../modules/Multer';
import asyncHandler from 'express-async-handler';
import {Request, Response} from 'express';
import routes from '../../routes/v1';
import postsService from './service';
import {postsSchema} from './schema';
import authorization from '../../common/middleware/Authorization';

const uploadFile = Multer.useMulter(
  Multer.getDefaultUploadFileOptions({
    dest: 'public/uploads',
    onlyImages: true,
  })
).fields([
  {name: 'documentations', maxCount: 3},
  {name: 'banner', maxCount: 1},
]);

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
  '/posts',
  authorization,
  uploadFile,
  // setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};

    const validateForm = postsSchema.validateSync(formData);

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await postsService.createPosts(
      req.userLogin.id,
      {
        ...formData,
        banner: savedFilePaths.find((e) => e.fieldName == 'banner')?.paths[0],
      },
      savedFilePaths.find((e) => e.fieldName == 'documentations')?.paths ?? []
    );

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/posts',
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await postsService.getAllPosts();

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/posts-me',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await postsService.getAllMyPosts(req.userLogin.id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.get(
  '/posts/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await postsService.getPostsById(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.delete(
  '/posts/:id',
  authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const serviceResponse = await postsService.deletePosts(id);

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);

routes.put(
  '/posts/:id',
  authorization,
  uploadFile,
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.body;

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};

    const validateForm = postsSchema.validateSync(formData);

    const savedFilePaths = await Multer.vercelBlobHandler(files);

    const serviceResponse = await postsService.updatePosts(req.params.id, {
      ...formData,
      banner: savedFilePaths.find((e) => e.fieldName == 'banner')?.paths[0],
    });

    res.status(serviceResponse.statusCode).json(serviceResponse);
  })
);
