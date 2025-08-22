require('dotenv').config();
const mongoose = require("mongoose");
const Notification = require("../app/models/Notification"); // adjust path
const User = require("../app/models/User");                 // adjust path

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Grab some existing users
  const john = await User.findOne({ email: "john@example.com" });
  const jane = await User.findOne({ email: "jane@example.com" });

  if (!john || !jane) {
    console.error("❌ Seed users first before seeding notifications!");
    process.exit(1);
  }

  const res = await Notification.insertMany([
    {
      title: "Welcome to F8!",
      description: "Thanks for joining our platform 🎉",
      image: "https://example.com/welcome.png",
      slug: "welcome-notification",
      notifiedBy: john._id,
      sendFor: "jane@example.com",
      isSeen: false
    },
    {
      title: "New Blog Posted",
      description: "Jane Smith just posted a new blog on MongoDB 🚀",
      image: "https://example.com/blog.png",
      slug: "new-blog",
      notifiedBy: jane._id,
      sendFor: "john@example.com",
      isSeen: false
    },
    {
      title: "System Update",
      description: "We’ve updated our system with new features.",
      image: "https://example.com/system.png",
      slug: "system-update",
      notifiedBy: john._id,
      sendFor: "all",
      isSeen: true
    }
  ]);

  console.log("notification seed res", res);
  console.log("✅ Notifications inserted!");
  mongoose.disconnect();
}

seed();
