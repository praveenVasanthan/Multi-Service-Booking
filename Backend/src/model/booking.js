import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    workingHours: {
      start: { type: String, required: false },
      end: { type: String, required: false },
    },
    workingDays: {
      type: [String],
      required: false,
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
