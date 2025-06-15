import mongoose from "mongoose";

const animeTech = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(animeTech);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Couldn't connect to MongoDB:", error);
  }
};
// connectDB()
export default {
  connectDB,
};
