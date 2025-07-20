import cors from 'cors';
import express, {ErrorRequestHandler, type Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';

import rateLimiter from './common/middleware/rateLimiter';
import requestLogger from './common/middleware/requestLogger';
import indexRouter from './routes/index';
import path from 'path';
import expressErrorResponse from './common/middleware/errorHandler';
import ResponseError from 'modules/response/ResponseError';

const logger = pino({name: 'server start'});
const app: Express = express();

const optCors: cors.CorsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    const allowedOrigin = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://portofolio-sendiko.vercel.app',
    ];

    console.log('Incomming origin : ' + origin);

    if (!origin || allowedOrigin.includes(origin)) {
      cb(null, true);
    } else {
      cb(new ResponseError.Forbidden('Not allowerd'));
    }
  },
};

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors(optCors));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
// app.use('/health-check', healthCheckRouter);
// app.use('/users', userRouter);
// app.use('/auth', authRouter);
app.use(indexRouter);

// Error handlers
app.use(expressErrorResponse as ErrorRequestHandler);

export {app, logger};
