
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stars: number;
  tags: string[];
  difficulty: Difficulty;
  isGoodFirstIssue: boolean;
  repoUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserStats {
  confidenceScore: number;
  streak: number;
  totalContributions: number;
  currentMilestone: string;
  heatmapData: { date: string; count: number }[];
}

export interface RepoAnalysis {
  name: string;
  structure: string[];
  techStack: string[];
  beginnerExplanation: string;
  contributionIdeas: {
    level: Difficulty;
    idea: string;
  }[];
  prompts: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  link: string;
}
