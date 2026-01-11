import { differenceInDays, startOfDay } from 'date-fns';

/**
 * Calculate confidence score based on multiple factors
 */
export const calculateConfidenceScore = (factors: {
  commits: number;
  pullRequests: number;
  stars: number;
  followers: number;
  streak: number;
  reposContributed: number;
}): number => {
  const weights = {
    commits: 0.25,
    pullRequests: 0.30,
    stars: 0.15,
    followers: 0.10,
    streak: 0.12,
    reposContributed: 0.08
  };

  // Normalize values (scale to 0-100)
  const normalized = {
    commits: Math.min(factors.commits / 10, 100),
    pullRequests: Math.min(factors.pullRequests / 5, 100),
    stars: Math.min(factors.stars / 50, 100),
    followers: Math.min(factors.followers / 100, 100),
    streak: Math.min(factors.streak * 2, 100),
    reposContributed: Math.min(factors.reposContributed * 10, 100)
  };

  const score = Object.entries(normalized).reduce((sum, [key, value]) => {
    return sum + value * weights[key as keyof typeof weights];
  }, 0);

  return Math.round(Math.min(score, 100));
};

/**
 * Calculate current streak from activity dates
 */
export const calculateStreak = (activityDates: Date[]): number => {
  if (activityDates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = activityDates
    .map(d => startOfDay(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  let streak = 0;
  let currentDate = today;

  for (const activityDate of sortedDates) {
    const daysDiff = differenceInDays(currentDate, activityDate);

    if (daysDiff === 0) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 86400000); // Move back 1 day
    } else if (daysDiff === 1) {
      streak++;
      currentDate = activityDate;
    } else {
      break; // Streak broken
    }
  }

  return streak;
};

/**
 * Calculate XP from activity
 */
export const calculateXP = (activity: {
  commits: number;
  pullRequests: number;
  issues: number;
  codeReviews: number;
}): number => {
  return (
    activity.commits * 10 +
    activity.pullRequests * 50 +
    activity.issues * 20 +
    activity.codeReviews * 30
  );
};

/**
 * Determine level from XP
 */
export const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * Determine repository difficulty
 */
export const determineRepoDifficulty = (repo: {
  stars: number;
  openIssues: number;
  language?: string;
}): 'beginner' | 'intermediate' | 'advanced' => {
  const complexLanguages = ['rust', 'c++', 'c', 'go', 'scala'];
  const isComplex = repo.language && complexLanguages.includes(repo.language.toLowerCase());

  if (repo.stars < 100 && repo.openIssues > 5 && !isComplex) {
    return 'beginner';
  } else if (repo.stars < 1000 || isComplex) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
};

/**
 * Award badges based on achievements
 */
export const awardBadges = (stats: {
  commits: number;
  pullRequests: number;
  streak: number;
  stars: number;
}): string[] => {
  const badges: string[] = [];

  if (stats.commits >= 100) badges.push('Commit Champion');
  if (stats.pullRequests >= 50) badges.push('PR Master');
  if (stats.streak >= 30) badges.push('30-Day Warrior');
  if (stats.streak >= 100) badges.push('Century Streak');
  if (stats.stars >= 100) badges.push('Rising Star');
  if (stats.stars >= 1000) badges.push('GitHub Celebrity');

  return badges;
};

/**
 * Format error messages consistently
 */
export const formatError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};