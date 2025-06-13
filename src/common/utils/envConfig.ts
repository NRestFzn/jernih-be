import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  HOST: z.string().min(1).default('localhost'),

  PORT: z.coerce.number().int().positive().default(8080),

  CORS_ORIGIN: z.string().url().default('http://localhost:8080'),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  FIRESTORE_TYPE: z.string(),

  FIRESTORE_PROJECT_ID: z.string(),

  FIRESTORE_PRIVATE_KEY_ID: z.string(),

  FIRESTORE_PRIVATE_KEY: z.string(),

  FIRESTORE_CLIENT_EMAIL: z.string(),

  FIRESTORE_CLIENT_ID: z.string(),

  FIRESTORE_AUTH_URI: z.string(),

  FIRESTORE_TOKEN_URI: z.string(),

  FIRESTORE_AUTH_PROVIDER: z.string(),

  FIRESTORE_CERT_CLIENT: z.string(),

  FIRESTORE_UNIVERSE_DOMAIN: z.string(),

  JWT_SECRET_ACCESS_TOKEN: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};
