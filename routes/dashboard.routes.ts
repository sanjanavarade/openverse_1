import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticateToken, dashboardController.getStats);
router.get('/activity-graph', authenticateToken, dashboardController.getActivityGraph);
router.get('/leaderboard', dashboardController.getLeaderboard);

export default router;