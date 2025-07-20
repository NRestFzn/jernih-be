import cors from 'cors';
import ResponseError from '../../modules/response/ResponseError';

export const optCors: cors.CorsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    const allowedOrigin = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://portofolio-sendiko.vercel.app',
    ];

    if (!origin || allowedOrigin.includes(origin)) {
      cb(null, true);
    } else {
      cb(new ResponseError.Forbidden('Not allowed'));
    }
  },
};
