require('dotenv').config();

const mongoose = require("mongoose");
const User = require("../app/models/User"); // path to your UserSchema file

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const res = await User.insertMany([
    {
      fullName: "John Doe",
      slug: "john-doe",
      email: "john@example.com",
      password: "hashedpassword123",
      phoneNumber: "1234567890",
      photoURL: "https://example.com/john.jpg",
      bookmark: [],
      activated: true,
      isAdmin: false,
      provider: "local",
      socials: {
        fb: "https://facebook.com/johndoe",
        youtube: "",
        linkedin: "https://linkedin.com/in/johndoe",
        instagram: "",
        twitter: ""
      },
      bio: "Full stack developer at F8",
      coursesEnrolled: []
    },
    {
      fullName: "Jane Smith",
      slug: "jane-smith",
      email: "jane@example.com",
      password: "hashedpassword456",
      phoneNumber: "9876543210",
      photoURL: "https://example.com/jane.jpg",
      bookmark: [],
      activated: true,
      isAdmin: true,
      provider: "google",
      socials: {
        fb: "",
        youtube: "https://youtube.com/janesmith",
        linkedin: "",
        instagram: "https://instagram.com/jane.smith",
        twitter: ""
      },
      bio: "Admin at F8",
      coursesEnrolled: []
    }
  ]);

  console.log('user seed res', res)

  console.log("✅ Users inserted!");
  mongoose.disconnect();
}

seed();
