import Joi from 'joi';

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50).required()
  })
};

// Post validation schemas
export const postSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).max(5000).required(),
    channel: Joi.string().valid('beginner-support', 'project-matchmaking', 'showcase', 'general').required(),
    tags: Joi.array().items(Joi.string()).max(5).optional()
  }),
  
  comment: Joi.object({
    content: Joi.string().min(1).max(1000).required()
  })
};

// Challenge validation schemas
export const challengeSchemas = {
  generate: Joi.object({
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    topic: Joi.string().min(2).max(50).required()
  }),
  
  submit: Joi.object({
    challengeId: Joi.string().required(),
    code: Joi.string().min(10).required(),
    language: Joi.string().required(),
    timeSpent: Joi.number().min(0).optional()
  })
};

// Mentor validation schemas
export const mentorSchemas = {
  register: Joi.object({
    expertise: Joi.array().items(Joi.string()).min(1).max(10).required(),
    bio: Joi.string().min(20).max(500).required(),
    languages: Joi.array().items(Joi.string()).optional(),
    timezone: Joi.string().optional()
  }),
  
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).optional()
  })
};

// Repository validation schemas
export const repoSchemas = {
  analyze: Joi.object({
    repoUrl: Joi.string().uri().pattern(/github\.com/).required()
  })
};

// README validation schemas
export const readmeSchemas = {
  generate: Joi.object({
    tone: Joi.string().valid('professional', 'friendly', 'technical', 'creative', 'minimal').optional()
  })
};

// Generic validation helper
export const validate = (schema: Joi.Schema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    throw new ValidationError('Validation failed', errors);
  }
  
  return value;
};

// Custom validation error class
export class ValidationError extends Error {
  errors: Array<{ field: string; message: string }>;
  
  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Middleware wrapper for validation
export const validateRequest = (schema: Joi.Schema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: any, res: any, next: any) => {
    try {
      req[property] = validate(schema, req[property]);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message,
          details: error.errors
        });
      } else {
        next(error);
      }
    }
  };
};