import { RequestHandler } from 'express';
import { Repository } from '../models/Repository.model';
import aiService from '../services/ai.service';
import cacheService from '../services/cache.service';
import { determineRepoDifficulty } from '../utils/helpers';
import githubService from '../services/github.service';
import logger from '../utils/logger.util';
import {User}  from '../models/User.model';

/**
 * Analyze a GitHub repository using AI
 */
export const analyzeRepository: RequestHandler = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const userId = req.user!.userId;

    if (!repoUrl) {
      res.status(400).json({ success: false, error: 'Repository URL required' });
      return;
    }

    const cacheKey = `repo_analysis:${repoUrl}`;
    const cached = cacheService.get<any>(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }

    const user = await User.findById(userId).select('+githubAccessToken');
    const repoData = await githubService.getRepositoryByUrl(
      repoUrl,
      user?.githubAccessToken
    );

    if (!repoData) {
      res.status(404).json({ success: false, error: 'Repository not found' });
      return;
    }

    const [owner, repoName] = repoData.full_name.split('/');
    const readme = await githubService.getRepositoryReadme(owner, repoName);
    const structure = await githubService.getRepositoryStructure(owner, repoName);

    const aiAnalysis = await aiService.analyzeRepository({
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      readme: readme || '',
      structure,
      stars: repoData.stargazers_count,
      openIssues: repoData.open_issues_count,
    });

    const difficulty = determineRepoDifficulty({
      stars: repoData.stargazers_count,
      openIssues: repoData.open_issues_count,
      language: repoData.language,
    });

    let repository = await Repository.findOne({
      userId,
      repoId: repoData.id,
    });

    if (!repository) {
      repository = new Repository({
        userId,
        repoId: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        owner,
        url: repoData.html_url,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        topics: repoData.topics || [],
        difficulty,
        aiAnalysis,
      });
    } else {
      repository.aiAnalysis = aiAnalysis;
      repository.lastAnalyzedAt = new Date();
      repository.analyzeCount += 1;
    }

    await repository.save();
    cacheService.set(cacheKey, repository, 3600);

    res.json({ success: true, data: repository });
  } catch (error) {
    logger.error('Repository analysis error:', error);
    res.status(500).json({ success: false, error: 'Analysis failed' });
  }
};

/**
 * Generate GitHub profile README using AI
 */
export const generateReadme: RequestHandler = async (req, res) => {
  try {
    const { tone = 'professional' } = req.body;
    const userId = req.user!.userId;

    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    if (!user.githubAccessToken) {
      res.status(400).json({ success: false, error: 'GitHub access token not found' });
      return;
    }

    const repos = await githubService.getUserRepositories(
      user.username,
      user.githubAccessToken
    );

    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
      }));

    const skills = Array.from(
      new Set(repos.map(r => r.language).filter(Boolean))
    );

    const readme = await aiService.generateProfileReadme(
      {
        name: user.name,
        username: user.username,
        bio: user.bio || '',
        skills,
        topRepos,
        stats: {
          publicRepos: user.publicRepos,
          totalStars: user.totalStars,
          followers: user.followers,
        },
      },
      tone
    );

    res.json({ success: true, data: { readme } });
  } catch (error) {
    logger.error('README generation error:', error);
    res.status(500).json({ success: false, error: 'Generation failed' });
  }
};
