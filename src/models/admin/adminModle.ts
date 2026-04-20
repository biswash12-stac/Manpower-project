import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


/**
 * yo chai harek admin docs ko type yei hunu parxa so that typescript le detect garna sakos
 */
export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin';
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return ;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  ;
});

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exclude inactive admins by default
AdminSchema.pre('find', function() {
  this.where({ isActive: true });
});

AdminSchema.pre('findOne', function() {
  this.where({ isActive: true });
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);