import mongoose from "mongoose";

export const connectDB = () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    mongoose.connect(MONGO_URI);
    console.log("Dadabase connected!");
  } catch (error) {
    console.log("Failed to connect databese:", error);
  }
};
