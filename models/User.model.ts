import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  githubAccessToken?: string;
  __v?: number; 
  

  
  // Metrics (cached from GitHub)
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  
  // OpenVerse-specific
  confidenceScore: number;
  rank: number;
  streak: number;
  lastActiveDate: Date;
  badges: string[];
  xp: number;
  level: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    githubId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    avatarUrl: { 
      type: String, 
      required: true 
    },
    bio: String,
    location: String,
    company: String,
    blog: String,
    githubAccessToken: { 
      type: String, 
      required: true,
      select: false // Don't return in queries by default
    },
    
    // Cached metrics
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    
    // Platform metrics
    confidenceScore: { type: Number, default: 0, min: 0, max: 100 },
    rank: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    badges: [{ type: String }],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    
    lastSyncedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: { 
      transform: (_, ret) => {
        delete ret.githubAccessToken;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for performance
userSchema.index({ confidenceScore: -1 });
userSchema.index({ rank: 1 });
userSchema.index({ xp: -1 });
export const User = mongoose.model<IUser>('User', userSchema);
