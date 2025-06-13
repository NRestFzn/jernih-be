import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import {StatusCodes} from 'http-status-codes';
import {ValidationError} from 'yup';

const unexpectedRequest: RequestHandler = (_req, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send('Not Found');
};

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

  res.locals.err = err;
  next(err);
};

export default (): [RequestHandler, ErrorRequestHandler] => [
  unexpectedRequest,
  addErrorToRequestLog,
];
