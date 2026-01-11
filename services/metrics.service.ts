import { User, IUser } from '../models/User.model';
import { Activity } from '../models/Activity.model';
import { Repository } from '../models/Repository.model';
import {
  calculateConfidenceScore,
  calculateStreak,
  calculateXP,
  calculateLevel,
  awardBadges
} from '../utils/helpers';
import logger from '../utils/logger.util';

class MetricsService {
  /**
   * Update all user metrics
   */
  async updateUserMetrics(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId).select('+githubAccessToken');
      if (!user) {
        throw new Error('User not found');
      }

      // Get activity data from last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const activities = await Activity.find({
        userId,
        date: { $gte: oneYearAgo }
      }).sort({ date: -1 });

      // Calculate totals
      const totalCommits = activities.reduce((sum, a) => sum + a.commits, 0);
      const totalPRs = activities.reduce((sum, a) => sum + a.pullRequests, 0);
      const totalIssues = activities.reduce((sum, a) => sum + a.issues, 0);
      const totalReviews = activities.reduce((sum, a) => sum + a.codeReviews, 0);

      // Get unique repos contributed to
      const reposContributed = new Set<string>();
      activities.forEach(a => {
        a.repositories.forEach(r => reposContributed.add(r));
      });

      // Calculate streak
      const activityDates = activities.map(a => a.date);
      const streak = calculateStreak(activityDates);

      // Calculate XP
      const totalXP = activities.reduce((sum, a) => sum + a.xpEarned, 0);
      user.xp = totalXP;
      user.level = calculateLevel(totalXP);

      // Calculate confidence score
      user.confidenceScore = calculateConfidenceScore({
        commits: totalCommits,
        pullRequests: totalPRs,
        stars: user.totalStars,
        followers: user.followers,
        streak,
        reposContributed: reposContributed.size
      });

      // Update streak
      user.streak = streak;

      // Award badges
      user.badges = awardBadges({
        commits: totalCommits,
        pullRequests: totalPRs,
        streak,
        stars: user.totalStars
      });

      // Calculate rank
      await this.updateUserRank(user);

      user.lastSyncedAt = new Date();
      await user.save();

      logger.info(`Metrics updated for user ${user.username}`);
      return user;
    } catch (error) {
      logger.error('Failed to update user metrics:', error);
      throw error;
    }
  }

  /**
   * Update user's global rank
   */
  private async updateUserRank(user: IUser): Promise<void> {
    try {
      // Count users with higher confidence score
      const higherRankedCount = await User.countDocuments({
        confidenceScore: { $gt: user.confidenceScore }
      });

      user.rank = higherRankedCount + 1;
    } catch (error) {
      logger.error('Failed to update user rank:', error);
    }
  }

  /**
   * Get activity graph data for last 365 days
   */
  async getActivityGraphData(userId: string): Promise<Array<{
    date: string;
    count: number;
  }>> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const activities = await Activity.find({
        userId,
        date: { $gte: oneYearAgo }
      }).select('date commits pullRequests issues codeReviews');

      // Format for frontend (GitHub-style contribution graph)
      return activities.map(activity => ({
        date: activity.date.toISOString().split('T')[0],
        count: activity.commits + activity.pullRequests + activity.issues + activity.codeReviews
      }));
    } catch (error) {
      logger.error('Failed to get activity graph data:', error);
      return [];
    }
  }

  /**
   * Get weekly activity summary
   */
  async getWeeklySummary(userId: string): Promise<{
    thisWeek: {
      commits: number;
      pullRequests: number;
      issues: number;
      codeReviews: number;
    };
    lastWeek: {
      commits: number;
      pullRequests: number;
      issues: number;
      codeReviews: number;
    };
    change: {
      commits: number;
      pullRequests: number;
      issues: number;
      codeReviews: number;
    };
  }> {
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const thisWeekActivities = await Activity.find({
        userId,
        date: { $gte: oneWeekAgo, $lte: now }
      });

      const lastWeekActivities = await Activity.find({
        userId,
        date: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
      });

      const sumActivities = (activities: typeof thisWeekActivities) => ({
        commits: activities.reduce((sum, a) => sum + a.commits, 0),
        pullRequests: activities.reduce((sum, a) => sum + a.pullRequests, 0),
        issues: activities.reduce((sum, a) => sum + a.issues, 0),
        codeReviews: activities.reduce((sum, a) => sum + a.codeReviews, 0)
      });

      const thisWeek = sumActivities(thisWeekActivities);
      const lastWeek = sumActivities(lastWeekActivities);

      const change = {
        commits: thisWeek.commits - lastWeek.commits,
        pullRequests: thisWeek.pullRequests - lastWeek.pullRequests,
        issues: thisWeek.issues - lastWeek.issues,
        codeReviews: thisWeek.codeReviews - lastWeek.codeReviews
      };

      return { thisWeek, lastWeek, change };
    } catch (error) {
      logger.error('Failed to get weekly summary:', error);
      return {
        thisWeek: { commits: 0, pullRequests: 0, issues: 0, codeReviews: 0 },
        lastWeek: { commits: 0, pullRequests: 0, issues: 0, codeReviews: 0 },
        change: { commits: 0, pullRequests: 0, issues: 0, codeReviews: 0 }
      };
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10): Promise<IUser[]> {
    try {
      return await User.find()
        .select('username name avatarUrl confidenceScore rank xp level badges')
        .sort({ confidenceScore: -1, xp: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Failed to get leaderboard:', error);
      return [];
    }
  }
}

export default new MetricsService();