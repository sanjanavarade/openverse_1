// src/services/ai.service.ts

interface AnalyzeRepoInput {
  name: string;
  description: string;
  language: string;
  readme: string;
  structure: any;
  stars: number;
  openIssues: number;
}

interface GenerateReadmeInput {
  name: string;
  username: string;
  bio: string;
  skills: string[];
  topRepos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
  }>;
  stats: {
    publicRepos: number;
    totalStars: number;
    followers: number;
  };
}

class AIService {
  async analyzeRepository(input: AnalyzeRepoInput) {
    // 🔹 Later: OpenAI / Gemini / Claude API call
    // For now: mock intelligent response

    return {
      summary: `This is a ${input.language} repository named ${input.name}.`,
      strengths: [
        'Well structured project',
        'Good open source potential',
      ],
      suggestedContributions: [
        'Improve documentation',
        'Fix open issues',
        'Add tests',
      ],
      stars: input.stars,
      openIssues: input.openIssues,
    };
  }

  async generateProfileReadme(
    input: GenerateReadmeInput,
    tone: string
  ): Promise<string> {
    return `
# 👋 Hi, I'm ${input.name}

${input.bio}

## 🚀 Skills
${input.skills.map(skill => `- ${skill}`).join('\n')}

## 🌟 Top Repositories
${input.topRepos
  .map(
    repo =>
      `- **${repo.name}** (${repo.language}) ⭐ ${repo.stars}`
  )
  .join('\n')}

## 📊 GitHub Stats
- Public Repos: ${input.stats.publicRepos}
- Total Stars: ${input.stats.totalStars}
- Followers: ${input.stats.followers}

_Tone: ${tone}_
`;
  }
}

export default new AIService();
