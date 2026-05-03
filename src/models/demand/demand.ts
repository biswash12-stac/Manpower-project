import mongoose, { Document, Schema } from 'mongoose';

export interface IDemand extends Document {
  title: string;
  category: string;
  quantity: number;
  gender: 'Male' | 'Female' | 'Both';
  ageRange: {
    min: number;
    max: number;
  };
  salary: string;
  location: string;
  country: string;
  requirements: string[];
  deadline: Date;
  status: 'active' | 'closed' | 'draft';
  publishedInNewspaper: boolean;
  newspaperName?: string;
  newspaperDate?: Date;
  newspaperImage?: string;           // URL of uploaded newspaper image
  newspaperImagePublicId?: string;   // For Cloudinary (if used)
  postedBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DemandSchema = new Schema<IDemand>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['general'],
      default: 'general',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Both'],
      default: 'Both',
    },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 50 },
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Nepal',
    },
    requirements: [String],
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'draft',
      index: true,
    },
    publishedInNewspaper: {
      type: Boolean,
      default: false,
    },
    newspaperName: {
      type: String,
      default: null,
    },
    newspaperDate: {
      type: Date,
      default: null,
    },
    newspaperImage: {
      type: String,
      default: null,
    },
    newspaperImagePublicId: {
      type: String,
      default: null,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DemandSchema.index({ status: 1, createdAt: -1 });
DemandSchema.index({ category: 1, status: 1 });
DemandSchema.index({ title: 'text' });

export default mongoose.models.Demand || mongoose.model<IDemand>('Demand', DemandSchema);