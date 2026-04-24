import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin/adminModle';
import Job from '../models/job/jobModel';
import { logger } from '../utils/logger';

dotenv.config({ path: '.env.local' });

type SeedResult =
  | { success: true; message: string }
  | { success: false; error: string; code: string };

const sampleJobs = [
  {
    title: "Software Engineer",
    company: "Gulf Empire",
    location: "Dubai, UAE",
    country: "UAE",
    type: "full-time",
    salary: "AED 8,000 - 12,000",
    description: "We are looking for a skilled software engineer to join our team...",
    requirements: ["3+ years experience", "React/Node.js"],
    benefits: ["Visa sponsorship", "Health insurance"],
    category: "Technology",
    status: "active",
    isFeatured: true,
  },
  {
    title: "Construction Supervisor",
    company: "Gulf Empire",
    location: "Kuwait City, Kuwait",
    country: "Kuwait",
    type: "full-time",
    salary: "KWD 800 - 1,200",
    description: "Seeking experienced construction supervisor...",
    requirements: ["5+ years experience", "Safety certification"],
    benefits: ["Accommodation", "Transportation"],
    category: "Construction",
    status: "active",
    isFeatured: true,
  },
  {
    title: "Hospitality Manager",
    company: "Gulf Empire",
    location: "Riyadh, Saudi Arabia",
    country: "Saudi Arabia",
    type: "full-time",
    salary: "SAR 5,000 - 8,000",
    description: "Looking for hospitality manager for luxury hotel...",
    requirements: ["3+ years management", "Hotel experience"],
    benefits: ["Staff accommodation", "Tips"],
    category: "Hospitality",
    status: "active",
    isFeatured: true,
  },
  {
    title: "Maintenance Technician",
    company: "Gulf Empire",
    location: "Doha, Qatar",
    country: "Qatar",
    type: "full-time",
    salary: "QAR 4,000 - 6,000",
    description: "Maintenance technician for industrial equipment...",
    requirements: ["2+ years experience", "Technical diploma"],
    benefits: ["Overtime pay", "Training"],
    category: "Maintenance",
    status: "active",
    isFeatured: false,
  },
];

async function seed(): Promise<SeedResult> {
  const startTime = Date.now();

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Keep existing admin logic untouched
    let admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (!admin) {
      admin = await Admin.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "superadmin",
      });

      logger.success(`Seeded admin: ${process.env.ADMIN_EMAIL}`);
    }

    // Clear old jobs only
    await Job.deleteMany({});
    logger.info("Existing jobs cleared");

    // Insert jobs
    for (const jobData of sampleJobs) {
      await Job.create({
        ...jobData,
        postedBy: admin._id,
        featuredAt: jobData.isFeatured ? new Date() : null,
      });
    }

    logger.success(`${sampleJobs.length} jobs seeded`);

    return {
      success: true,
      message: "Seed completed",
    };
  } catch (error) {
    const mongoError = error as { code?: number };
    const errorCode = mongoError.code === 11000 ? "DUPLICATE" : "UNKNOWN";

    return {
      success: false,
      error: (error as Error).message,
      code: errorCode,
    };
  } finally {
    await mongoose.disconnect();
    logger.info(`Seed finished in ${Date.now() - startTime}ms`);
  }
}

// Execute
seed().then((result) => {
  if (!result.success) process.exit(1);
});