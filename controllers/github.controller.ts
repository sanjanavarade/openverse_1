import githubService from '../services/github.service';
import { Request, Response } from 'express';
import logger from '../utils/logger.util';
import {User} from '../models/User.model';

class GitHubController {
  async searchRepositories(req: Request, res: Response): Promise<void> {
    try {
      const { language, topics, minStars, hasIssues } = req.query;

      const results = await githubService.searchRepositories({
        language: language as string,
        topics: topics ? (topics as string).split(',') : undefined,
        minStars: minStars ? parseInt(minStars as string) : undefined,
        hasIssues: hasIssues === 'true'
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      logger.error('Repository search error:', error);
      res.status(500).json({ success: false, error: 'Search failed' });
    }
  }

  async getRepositoryDetails(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.query;

      if (!url) {
        res.status(400).json({ success: false, error: 'Repository URL required' });
        return;
      }

      const accessToken = req.user ? (await User.findById(req.user.userId).select('+githubAccessToken'))?.githubAccessToken : undefined;
      const repo = await githubService.getRepositoryByUrl(url as string, accessToken);

      if (!repo) {
        res.status(404).json({ success: false, error: 'Repository not found' });
        return;
      }

      res.json({
        success: true,
        data: repo
      });
    } catch (error) {
      logger.error('Get repository error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch repository' });
    }
  }
}

export default new GitHubController();