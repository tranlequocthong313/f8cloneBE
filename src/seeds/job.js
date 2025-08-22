require('dotenv').config();
const mongoose = require("mongoose");
const Job = require("../app/models/Job");   // adjust path to your JobSchema file
const User = require("../app/models/User"); // adjust path to your UserSchema file

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Get some existing users
  const john = await User.findOne({ email: "john@example.com" });
  const jane = await User.findOne({ email: "jane@example.com" });

  if (!john || !jane) {
    console.error("❌ Seed users first before seeding jobs!");
    process.exit(1);
  }

  const res = await Job.insertMany([
    {
      title: "Fullstack Developer",
      minSalary: 1200,
      maxSalary: 2000,
      languages: ["JavaScript", "Node.js", "React"],
      postedBy: john._id
    },
    {
      title: "Backend Engineer",
      minSalary: 1500,
      maxSalary: 2500,
      languages: ["Python", "Django", "PostgreSQL"],
      postedBy: jane._id
    },
    {
      title: "Frontend Developer",
      minSalary: 1000,
      maxSalary: 1800,
      languages: ["HTML", "CSS", "Vue.js"],
      postedBy: john._id
    }
  ]);

  console.log("job seed res", res);
  console.log("✅ Jobs inserted!");
  mongoose.disconnect();
}

seed();
