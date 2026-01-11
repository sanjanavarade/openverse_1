import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  
  // GitHub activity counts
  commits: number;
  pullRequests: number;
  issues: number;
  codeReviews: number;
  
  // Repositories contributed to
  repositories: string[];
  
  // Contribution types
  contributionTypes: {
    code: number;
    documentation: number;
    bugFix: number;
    feature: number;
  };
  
  // XP earned that day
  xpEarned: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    date: { 
      type: Date, 
      required: true,
      index: true 
    },
    
    commits: { type: Number, default: 0 },
    pullRequests: { type: Number, default: 0 },
    issues: { type: Number, default: 0 },
    codeReviews: { type: Number, default: 0 },
    
    repositories: [String],
    
    contributionTypes: {
      code: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
      bugFix: { type: Number, default: 0 },
      feature: { type: Number, default: 0 },
    },
    
    xpEarned: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Unique constraint: one activity record per user per day
activitySchema.index({ userId: 1, date: 1 }, { unique: true });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);