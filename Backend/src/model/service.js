import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  durationMinutes: Number,
  imageUrl: String,
  workingHours: {
    start: { type: String, default: "09:00" },
    end: { type: String, default: "18:00" },
  },
  workingDays: {
    type: [String],
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
});

const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
