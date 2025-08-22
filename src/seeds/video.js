const Video = require("../app/models/Video"); // adjust path to your VideoSchema file

async function seed() {
  try {
    const res = await Video.insertMany([
      {
        videoId: "x0fSBAgBrOQ",
        duration: "10:32",
        title: "Learn JavaScript Basics",
        search: "javascript tutorial beginner",
        image: "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png",
        viewCount: 1500,
        likeCount: 230,
        commentCount: 12,
        isPopular: true
      },
      {
        videoId: "30sMCciFIAM",
        duration: "07:45",
        title: "Node.js Crash Course",
        search: "nodejs tutorial crash course",
        image: "https://files.fullstack.edu.vn/f8-prod/courses/6.png",
        viewCount: 2500,
        likeCount: 420,
        commentCount: 30,
        isPopular: true
      },
      {
        videoId: "9QeNLypIiZs",
        duration: "15:10",
        title: "Mastering MongoDB with Mongoose",
        search: "mongodb mongoose tutorial",
        image: "https://files.fullstack.edu.vn/f8-prod/courses/4/61a9e9e701506.png",
        viewCount: 3200,
        likeCount: 580,
        commentCount: 45,
        isPopular: false
      }
    ]);

    console.log("video seed res", res);
    console.log("✅ Videos inserted!");
  } catch (error) {
    console.log('video not inserted')    
  }
}

module.exports = seed;
