import cors from 'cors';
import express, {ErrorRequestHandler, type Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';

import rateLimiter from './common/middleware/rateLimiter';
import requestLogger from './common/middleware/requestLogger';
import indexRouter from './routes/index';
import path from 'path';
import expressErrorResponse from './common/middleware/errorHandler';
import ExpressErrorYup from './common/middleware/expressErrorYup';
import {optCors} from './common/helpers/optCors';

const logger = pino({name: 'server start'});
const app: Express = express();

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
app.use(ExpressErrorYup as ErrorRequestHandler);

export {app, logger};
