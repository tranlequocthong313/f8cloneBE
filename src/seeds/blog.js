require('dotenv').config();
const mongoose = require("mongoose");
const Blog = require("../app/models/Blog"); // adjust path
const User = require("../app/models/User"); // adjust path

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // get users we seeded before
  const john = await User.findOne({ email: "john@example.com" });
  const jane = await User.findOne({ email: "jane@example.com" });

  if (!john || !jane) {
    console.error("❌ Seed users first before seeding blogs!");
    process.exit(1);
  }

  const res = await Blog.insertMany([
    {
      title: "Getting Started with Node.js",
      search: "nodejs tutorial beginner",
      content: "This is a beginner guide to Node.js...",
      readingTime: 8,
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg",
      titleDisplay: "Node.js Basics",
      description: "Learn the basics of Node.js in this article.",
      tags: ["nodejs", "javascript", "backend"],
      slug: "getting-started-with-node-js", // slug generator will override if missing
      likes: [john._id],
      comments: [
        {
          content: "Great article!",
          postedBy: jane._id,
          reacts: [{ reactedBy: john._id, emoji: "👍" }],
          replies: [
            {
              content: "Thanks! Glad it helped 😊",
              postedBy: john._id,
              reacts: []
            }
          ]
        }
      ],
      schedule: "2025-09-01",
      postedBy: john._id,
      allowRecommend: true,
      isPopular: true,
      isVerified: true,
      isPosted: true
    },
    {
      title: "MongoDB & Mongoose Deep Dive",
      search: "mongodb mongoose guide",
      content: "This blog explains how to use MongoDB with Mongoose...",
      readingTime: 12,
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/1671/61b6368983c16.jpg",
      titleDisplay: "MongoDB + Mongoose",
      description: "Learn MongoDB + Mongoose in depth.",
      tags: ["mongodb", "mongoose", "database"],
      likes: [jane._id],
      comments: [],
      schedule: "2025-09-10",
      postedBy: jane._id,
      allowRecommend: true,
      isPopular: true,
      isVerified: true,
      isPosted: true
    }
  ]);

  console.log("blog seed res", res);
  console.log("✅ Blogs inserted!");
  mongoose.disconnect();
}

seed();
