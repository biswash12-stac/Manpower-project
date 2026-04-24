import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  // Which job they're applying for
  jobId: mongoose.Types.ObjectId;
  jobTitle?: string; // Denormalized for quick display

  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city?: string;

  // Professional Information
  position: string;
  experience: number;
  skills: string[];
  coverLetter: string;

  // Documents
  resumeUrl: string;
  resumePublicId?: string;

  // Status tracking
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  reviewedAt?: Date;

  // Timestamps
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      index: true,
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    country: {
      type: String,
      required: [true, 'Country is required'],
    },

    city: String,

    position: {
      type: String,
      required: [true, 'Position is required'],
    },

    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
      max: 50,
    },

    skills: [String],

    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
    },

    resumeUrl: {
      type: String,
      required: [true, 'Resume is required'],
    },

    resumePublicId: String,

    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    reviewNotes: String,

    reviewedAt: Date,

    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for same job and email
ApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

// Compound index for admin filtering
ApplicationSchema.index({ status: 1, appliedAt: -1 });
ApplicationSchema.index({ jobId: 1, status: 1 });

// Auto-populate job title before save
ApplicationSchema.pre('save', async function (next) {
  if (this.isModified('jobId') && !this.jobTitle) {
    const Job = mongoose.model('Job');
    const job = await Job.findById(this.jobId).select('title');

    if (job) {
      this.jobTitle = (job as any).title;
    }
  }

  ;
});

export default mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema);