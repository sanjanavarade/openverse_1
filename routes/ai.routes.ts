import { Router } from 'express';
import {
  analyzeRepository,
  generateReadme,
} from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/aiLimiter';

const router = Router();

router.post(
  '/analyze-repository',
  authenticateToken,
  aiLimiter,
  analyzeRepository
);

router.post(
  '/generate-readme',
  authenticateToken,
  aiLimiter,
  generateReadme
);

export default router;
