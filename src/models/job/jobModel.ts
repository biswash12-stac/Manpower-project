import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  country: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  category: string;
  experience: string;
  vacancies: number;
  deadline?: Date;
  status: 'active' | 'closed' | 'draft';
  postedBy: mongoose.Types.ObjectId;
  views: number;
  applicationsCount: number;
  // Featured fields
  isFeatured: boolean;
  featuredAt?: Date;
  featuredExpiry?: Date;
  // Soft delete
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote'],
      required: [true, 'Job type is required'],
    },
    salary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [String],
    benefits: [String],
    category: String,
    experience: String,
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: Date,
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'draft',
      index: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    // ⭐ NEW: Featured job fields
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredAt: {
      type: Date,
      default: null,
    },
    featuredExpiry: {
      type: Date,
      default: null,
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for featured jobs
JobSchema.index({ isFeatured: -1, featuredAt: -1 });
JobSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });

// Text search index
JobSchema.index({ title: 'text', description: 'text', company: 'text' });

// Compound indexes for filtering
JobSchema.index({ status: 1, isDeleted: 1, isFeatured: -1, createdAt: -1 });
JobSchema.index({ location: 1, status: 1 });
JobSchema.index({ category: 1, status: 1 });

// Auto-filter soft-deleted jobs
JobSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

JobSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);