// ✅ THIS IS THE COMPLETE error.middleware.ts FILE
// Copy this entire file to: src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util';
import { config } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;
  const statusCode = error.statusCode || 500;

  logger.error('Error occurred:', {
    message: error.message,
    statusCode,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.userId || 'anonymous'
  });

  const response: any = {
    success: false,
    error: error.message || 'Internal server error',
    statusCode
  };

  if (config.env === 'development') {
    response.stack = error.stack;
    response.details = {
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    };
  }

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export class ValidationError extends Error {
  errors: Array<{ field: string; message: string }>;
  statusCode: number;

  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.statusCode = 400;
  }
}

export const handleDatabaseError = (error: any): AppError => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return new AppError(`${field} already exists`, 409);
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return new AppError(`Validation failed: ${errors.join(', ')}`, 400);
  }

  if (error.name === 'CastError') {
    return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
  }

  return new AppError('Database operation failed', 500);
};

export const handleJWTError = (error: any): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token expired', 401);
  }
  return new AppError('Authentication failed', 401);
};