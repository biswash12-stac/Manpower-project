import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin/adminModle';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (exists) {
      console.log("Admin already exists");
      return;
    }

    await Admin.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("Admin created");

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();