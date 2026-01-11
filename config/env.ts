import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: Joi.string().required(),
  GEMINI_API_KEY: Joi.string().required(),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  CACHE_TTL: Joi.number().default(3600),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
}).unknown();

const { error, value: validatedEnv } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const config = {
  env: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  mongodb: {
    uri: validatedEnv.MONGODB_URI,
  },
  frontend: {
    url: validatedEnv.FRONTEND_URL,
  },
  jwt: {
    secret: validatedEnv.JWT_SECRET,
    expiresIn: validatedEnv.JWT_EXPIRES_IN,
  },
  github: {
    clientId: validatedEnv.GITHUB_CLIENT_ID,
    clientSecret: validatedEnv.GITHUB_CLIENT_SECRET,
    callbackUrl: validatedEnv.GITHUB_CALLBACK_URL,
  },
  ai: {
    geminiApiKey: validatedEnv.GEMINI_API_KEY,
  },
  rateLimit: {
    windowMs: validatedEnv.RATE_LIMIT_WINDOW_MS,
    maxRequests: validatedEnv.RATE_LIMIT_MAX_REQUESTS,
  },
  cache: {
    ttl: validatedEnv.CACHE_TTL,
  },
  log: {
    level: validatedEnv.LOG_LEVEL,
  },
};