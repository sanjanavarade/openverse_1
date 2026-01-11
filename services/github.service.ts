import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';
import logger from '../utils/logger.util';

interface GitHubUser {
  id: number;
  login: string;
  email: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  has_issues: boolean;
}

class GitHubService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  }

  /**
   * Exchange OAuth code for access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code
        },
        {
          headers: { Accept: 'application/json' }
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token received from GitHub');
      }

      return response.data.access_token;
    } catch (error) {
      logger.error('GitHub OAuth token exchange failed:', error);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  /**
   * Get authenticated user profile
   */
  async getUserProfile(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await this.client.get<GitHubUser>('/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Get user's email (if not public)
   */
  async getUserEmail(accessToken: string): Promise<string> {
    try {
      const response = await this.client.get('/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const primaryEmail = response.data.find((e: any) => e.primary && e.verified);
      return primaryEmail?.email || response.data[0]?.email;
    } catch (error) {
      logger.error('Failed to fetch GitHub user email:', error);
      throw new Error('Failed to fetch user email');
    }
  }

  /**
   * Get user's public repositories
   */
  async getUserRepositories(username: string, accessToken: string): Promise<GitHubRepo[]> {
    try {
      const response = await this.client.get<GitHubRepo[]>(
        `/users/${username}/repos`,
        {
          params: { per_page: 100, sort: 'updated' },
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch user repositories:', error);
      return [];
    }
  }

  /**
   * Search repositories with filters
   */
  async searchRepositories(params: {
    language?: string;
    topics?: string[];
    minStars?: number;
    hasIssues?: boolean;
  }): Promise<GitHubRepo[]> {
    try {
      let query = 'is:public';

      if (params.language) {
        query += ` language:${params.language}`;
      }

      if (params.topics && params.topics.length > 0) {
        params.topics.forEach(topic => {
          query += ` topic:${topic}`;
        });
      }

      if (params.minStars) {
        query += ` stars:>=${params.minStars}`;
      }

      if (params.hasIssues) {
        query += ' good-first-issues:>1';
      }

      const response = await this.client.get('/search/repositories', {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 50
        }
      });

      return response.data.items || [];
    } catch (error) {
      logger.error('Repository search failed:', error);
      return [];
    }
  }

  /**
   * Get repository details by URL
   */
  async getRepositoryByUrl(repoUrl: string, accessToken?: string): Promise<GitHubRepo | null> {
    try {
      // Extract owner/repo from URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace('.git', '');

      const headers: any = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await this.client.get<GitHubRepo>(
        `/repos/${owner}/${cleanRepo}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch repository:', error);
      return null;
    }
  }

  /**
   * Get user's contribution stats
   */
  async getUserStats(username: string, accessToken: string) {
    try {
      // Get events (commits, PRs, issues)
      const eventsResponse = await this.client.get(`/users/${username}/events/public`, {
        params: { per_page: 100 },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const events = eventsResponse.data;

      // Count by type
      const stats = {
        commits: events.filter((e: any) => e.type === 'PushEvent').length,
        pullRequests: events.filter((e: any) => e.type === 'PullRequestEvent').length,
        issues: events.filter((e: any) => e.type === 'IssuesEvent').length,
        codeReviews: events.filter((e: any) => e.type === 'PullRequestReviewEvent').length
      };

      // Get repos contributed to
      const reposContributed = new Set(
        events
          .filter((e: any) => e.repo)
          .map((e: any) => e.repo.name)
      );

      return {
        ...stats,
        reposContributed: reposContributed.size,
        recentActivity: events.slice(0, 10).map((e: any) => ({
          type: e.type,
          repo: e.repo?.name,
          createdAt: e.created_at
        }))
      };
    } catch (error) {
      logger.error('Failed to fetch user stats:', error);
      return {
        commits: 0,
        pullRequests: 0,
        issues: 0,
        codeReviews: 0,
        reposContributed: 0,
        recentActivity: []
      };
    }
  }

  /**
   * Get repository README content
   */
  async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.raw' }
      });

      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get repository structure (tree)
   */
  async getRepositoryStructure(owner: string, repo: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/repos/${owner}/${repo}/git/trees/main?recursive=1`
      );

      return response.data.tree || [];
    } catch (error) {
      // Try 'master' branch if 'main' fails
      try {
        const response = await this.client.get(
          `/repos/${owner}/${repo}/git/trees/master?recursive=1`
        );
        return response.data.tree || [];
      } catch {
        return [];
      }
    }
  }
}

export default new GitHubService();