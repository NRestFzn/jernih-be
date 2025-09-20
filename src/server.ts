import cors from 'cors';
import express, {type Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';

import errorHandler from './common/middleware/errorHandler';
import rateLimiter from './common/middleware/rateLimiter';
import requestLogger from './common/middleware/requestLogger';
import indexRouter from './routes/index';
import path from 'path';

const logger = pino({name: 'server start'});
const app: Express = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jernih-us.vercel.app',
];

const corsOptions: any = {
  origin: (origin: string, callback: any) => {
    console.log('Request datang dari Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin ini tidak diizinkan oleh kebijakan CORS'));
    }
  },
  credentials: true,
};

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(cors(corsOptions));
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
