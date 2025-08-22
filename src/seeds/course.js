require('dotenv').config();
const mongoose = require("mongoose");
const Course = require("../app/models/Course"); // adjust path

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const courses = [
    {
      title: "JavaScript Fundamentals",
      search: "javascript course beginner",
      description: "Learn the basics of JavaScript including variables, loops, and functions.",
      videoId: "OOt2VRa1Oeg",
      image: "https://files.fullstack.edu.vn/f8-prod/courses/7.png",
      level: "Beginner",
      studentCount: 1500,
      topics: ["Variables", "Functions", "Loops", "DOM"],
      requirement: ["Basic computer knowledge"],
      episode: [
        {
          episodeId: "ep1",
          title: "Introduction to JavaScript",
          learning: true,
          lessons: [
            {
              lessonId: "l1",
              title: "What is JavaScript?",
              time: "05:32",
              learned: true,
              videoId: "x0fSBAgBrOQ"
            },
            {
              lessonId: "l2",
              title: "Variables and Constants",
              time: "08:10",
              learned: true,
              videoId: "30sMCciFIAM"
            }
          ]
        }
      ],
      role: {
        Fe: "John Doe",
        Be: "Jane Smith"
      },
      comments: [
        {
          content: "This course is really helpful!",
          postedBy: new mongoose.Types.ObjectId(), // fake user ref
          isCode: false,
          reacts: [
            { reactedBy: new mongoose.Types.ObjectId(), emoji: "👍" }
          ],
          replies: [
            {
              content: "Glad you liked it!",
              postedBy: new mongoose.Types.ObjectId(),
              isCode: false,
              reacts: []
            }
          ]
        }
      ]
    },
    {
      title: "Node.js Crash Course",
      search: "nodejs crash backend",
      description: "A quick introduction to building backend APIs with Node.js and Express.",
      videoId: "SdphnMywCbo",
      image: "https://files.fullstack.edu.vn/f8-prod/courses/2.png",
      level: "Intermediate",
      studentCount: 950,
      topics: ["Express", "Routing", "Middleware", "MongoDB"],
      requirement: ["Basic JavaScript"],
      episode: [
        {
          episodeId: "ep1",
          title: "Setup & Express Basics",
          learning: false,
          lessons: [
            {
              lessonId: "l1",
              title: "Setting up Node.js",
              time: "06:50",
              learned: true,
              videoId: "9QeNLypIiZs"
            },
            {
              lessonId: "l2",
              title: "Express Routing",
              time: "09:15",
              learned: true,
              videoId: "9QeNLypIiZs"
            }
          ]
        }
      ],
      role: {
        Fe: "Alice Dev",
        Be: "Bob Backend"
      },
      comments: []
    }
  ];

  // ✅ Use create() so mongoose-slug-generator runs
  const res = await Course.create(courses);

  console.log("course seed res", res);
  console.log("✅ Courses inserted with slug!");
  mongoose.disconnect();
}

seed();
