import type {NextFunction, Request, Response} from 'express';
import _ from 'lodash';
import ResponseError from '../../modules/response/ResponseError';
import multer from 'multer';

function generateErrorResponse(
  e: Error,
  code: Number
):
  | {
      success: boolean;
      code: Number;
      message: string;
    }
  | string {
  return _.isObject(e.message)
    ? e.message
    : {success: false, code, message: e.message};
}

async function expressErrorResponse(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ResponseError.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponse(err, err.statusCode));
  }

  const errorResponse = generateErrorResponse(err, 500);
  if (
    err &&
    typeof errorResponse === 'object' &&
    'message' in errorResponse &&
    errorResponse.message.includes('ENOENT')
  ) {
    return res.status(500).json(errorResponse);
  }

  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(generateErrorResponse(err, 400));
  }

  next(err);
}

export default expressErrorResponse;
