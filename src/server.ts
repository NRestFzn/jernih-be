import cors from 'cors';
import express, {type Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';

import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import indexRouter from '@/routes/index';
import path from 'path';

const logger = pino({name: 'server start'});
const app: Express = express();

const optCors: cors.CorsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://jernih-us.vercel.app',
  ],
};

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(cors(optCors));
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
app.use(errorHandler());

export {app, logger};
