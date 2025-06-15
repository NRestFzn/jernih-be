import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import {StatusCodes} from 'http-status-codes';
import {ValidationError} from 'yup';
import multer from 'multer';
import _ from 'lodash';

const unexpectedRequest: RequestHandler = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send('Not Found');
};

function generateErrorResponseError(
  e: Error,
  code: Number
):
  | string
  | {
      code: Number;
      message: string;
    } {
  return _.isObject(e.message) ? e.message : {code, message: e.message};
}

const addErrorToRequestLog: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    const errType = `Yup Validation Error:`;
    const message = err.errors.join('<br/>') || 'Yup Validation Error !';

    const error = {
      code: 422,
      message,
      errors:
        err.inner.length > 0
          ? err.inner.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type;
              return acc;
            }, {})
          : {[`${err.path}`]: err.message || err.type},
    };
    res.status(422).json(error);
    return;
  }

  if (err instanceof multer.MulterError) {
    res.status(400).json(generateErrorResponseError(err, 400));
    return;
  }

  res.locals.err = err;
  next(err);
};

export default (): [RequestHandler, ErrorRequestHandler] => [
  unexpectedRequest,
  addErrorToRequestLog,
];
