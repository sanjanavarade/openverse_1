import mongoose, { Document, Schema } from 'mongoose';

export interface IRepository extends Document {
  userId: mongoose.Types.ObjectId;
  repoId: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  openIssues: number;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isGoodFirstIssue: boolean;
  contributionScore: number;
  aiAnalysis?: {
    summary?: string;
    strengths?: string[];
    suggestedImprovements?: string[];
    entryPoints?: string[];
    techStack?: string[];
    contributionOpportunities?: string[];
    estimatedComplexity?: string;
  };
  lastAnalyzedAt: Date;
  analyzeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    repoId: { type: Number, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true, index: true },
    owner: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    language: { type: String, index: true },
    stars: { type: Number, default: 0, index: true },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    topics: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
      index: true,
    },
    isGoodFirstIssue: { type: Boolean, default: false, index: true },
    contributionScore: { type: Number, default: 0, min: 0, max: 100 },
    aiAnalysis: {
      summary: String,
      strengths: [String],
      suggestedImprovements: [String],
      entryPoints: [String],
      techStack: [String],
      contributionOpportunities: [String],
      estimatedComplexity: String,
    },
    lastAnalyzedAt: { type: Date, default: Date.now },
    analyzeCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false, // ✅ removes __v safely (NO delete needed)
  }
);

/* ===================== Indexes ===================== */
repositorySchema.index({ userId: 1, repoId: 1 }, { unique: true });
repositorySchema.index({ difficulty: 1, stars: -1 });
repositorySchema.index({ language: 1, stars: -1 });
repositorySchema.index({ isGoodFirstIssue: 1, difficulty: 1 });
repositorySchema.index({ topics: 1 });

/* ===================== Virtuals ===================== */
repositorySchema.virtual('isRecentlyAnalyzed').get(function (this: IRepository) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.lastAnalyzedAt > oneDayAgo;
});

/* ===================== Middleware ===================== */
/**
 * IMPORTANT:
 * - No `next()` (avoids TS2349)
 * - No arrow function (keeps correct `this`)
 */
repositorySchema.pre('save', function (this: IRepository) {
  if (this.isModified('aiAnalysis')) {
    this.analyzeCount += 1;
    this.lastAnalyzedAt = new Date();
  }
});

export const Repository = mongoose.model<IRepository>(
  'Repository',
  repositorySchema
);
