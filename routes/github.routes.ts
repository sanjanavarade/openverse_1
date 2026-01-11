import { Router } from 'express';
import githubController from '../controllers/github.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/repositories/search', githubController.searchRepositories);
router.get('/repositories/details', optionalAuth, githubController.getRepositoryDetails);

export default router;