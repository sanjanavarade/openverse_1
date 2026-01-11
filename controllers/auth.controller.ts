import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Activity } from '../models/Activity.model';
import githubService from '../services/github.service';
import metricsService from '../services/metrics.service';
import { generateToken } from '../utils/jwt.util';
import { calculateXP } from '../utils/helpers';
import logger from '../utils/logger.util';
import { config } from '../config/env';
import { startOfDay } from 'date-fns';

class AuthController {
  /**
   * Initiate GitHub OAuth flow
   */
  async githubLogin(req: Request, res: Response): Promise<void> {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&scope=user:email%20repo%20read:user`;
    res.redirect(githubAuthUrl);
  }

  /**
   * Handle GitHub OAuth callback
   */
  async githubCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query;

      if (!code) {
        res.redirect(`${config.frontend.url}?error=no_code`);
        return;
      }

      // Exchange code for access token
      const accessToken = await githubService.exchangeCodeForToken(code as string);

      // Get user profile from GitHub
      const githubUser = await githubService.getUserProfile(accessToken);

      // Get email if not public
      let email = githubUser.email;
      if (!email) {
        email = await githubService.getUserEmail(accessToken);
      }

      // Find or create user
      let user = await User.findOne({ githubId: githubUser.id.toString() });

      if (!user) {
        // Create new user
        user = new User({
          githubId: githubUser.id.toString(),
          username: githubUser.login,
          email,
          name: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url,
          bio: githubUser.bio,
          location: githubUser.location,
          company: githubUser.company,
          blog: githubUser.blog,
          githubAccessToken: accessToken,
          publicRepos: githubUser.public_repos,
          followers: githubUser.followers,
          following: githubUser.following
        });

        await user.save();
        logger.info(`New user created: ${user.username}`);

        // Sync initial data in background
        this.syncUserDataBackground(user._id.toString(), accessToken);
      } else {
        // Update existing user
        user.githubAccessToken = accessToken;
        user.name = githubUser.name || user.name;
        user.avatarUrl = githubUser.avatar_url;
        user.bio = githubUser.bio;
        user.location = githubUser.location;
        user.company = githubUser.company;
        user.blog = githubUser.blog;
        user.publicRepos = githubUser.public_repos;
        user.followers = githubUser.followers;
        user.following = githubUser.following;

        await user.save();
        logger.info(`User logged in: ${user.username}`);

        // Sync data if not synced recently (last 24 hours)
        const daysSinceSync = (Date.now() - user.lastSyncedAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceSync > 1) {
          this.syncUserDataBackground(user._id.toString(), accessToken);
        }
      }

      // Generate JWT
      const token = generateToken({
        userId: user._id.toString(),
        githubId: user.githubId,
        username: user.username
      });

      // Redirect to frontend with token
      res.redirect(`${config.frontend.url}?token=${token}`);
    } catch (error) {
      logger.error('GitHub OAuth callback error:', error);
      res.redirect(`${config.frontend.url}?error=oauth_failed`);
    }
  }

  /**
   * Get current user info
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
        return;
      }

      const user = await User.findById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user info'
      });
    }
  }

  /**
   * Logout (client-side only, as JWT is stateless)
   */
  async logout(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  /**
   * Sync user data from GitHub (background task)
   */
  private async syncUserDataBackground(userId: string, accessToken: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      logger.info(`Starting background sync for ${user.username}`);

      // Get user stats from GitHub
      const stats = await githubService.getUserStats(user.username, accessToken);

      // Get repositories
      const repos = await githubService.getUserRepositories(user.username, accessToken);

      // Calculate total stars from owned repos
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      user.totalStars = totalStars;

      // Create activity record for today
      const today = startOfDay(new Date());
      
      let activity = await Activity.findOne({ userId, date: today });

      if (!activity) {
        activity = new Activity({
          userId,
          date: today,
          commits: stats.commits,
          pullRequests: stats.pullRequests,
          issues: stats.issues,
          codeReviews: stats.codeReviews,
          repositories: Array.from(new Set(stats.recentActivity.map((a: any) => a.repo))).filter(Boolean),
          xpEarned: calculateXP({
            commits: stats.commits,
            pullRequests: stats.pullRequests,
            issues: stats.issues,
            codeReviews: stats.codeReviews
          })
        });

        await activity.save();
      }

      // Update metrics
      await metricsService.updateUserMetrics(userId);

      logger.info(`Background sync completed for ${user.username}`);
    } catch (error) {
      logger.error('Background sync error:', error);
    }
  }
}

export default new AuthController();