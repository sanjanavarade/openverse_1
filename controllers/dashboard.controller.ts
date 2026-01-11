import { Request, Response } from 'express';
import { User } from '../models/User.model';
import metricsService from '../services/metrics.service';
import logger from '../utils/logger.util';

class DashboardController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const weeklySummary = await metricsService.getWeeklySummary(userId);

      res.json({
        success: true,
        data: {
          confidenceScore: user.confidenceScore,
          rank: user.rank,
          streak: user.streak,
          xp: user.xp,
          level: user.level,
          badges: user.badges,
          publicRepos: user.publicRepos,
          followers: user.followers,
          totalStars: user.totalStars,
          weeklySummary
        }
      });
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
  }

  async getActivityGraph(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const graphData = await metricsService.getActivityGraphData(userId);

      res.json({
        success: true,
        data: graphData
      });
    } catch (error) {
      logger.error('Get activity graph error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch activity data' });
    }
  }

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await metricsService.getLeaderboard(limit);

      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      logger.error('Get leaderboard error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
    }
  }
}

export default new DashboardController();