import { connectDB } from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serviceRoute from "./route/service.js";
import cartRoute from "./route/cart.js";
import bookingRoute from "./route/booking.js";
import userRoutes from "./route/authRoute.js";
dotenv.config();

const app = express();

// Middilwares
app.use(express.json());
app.use(cors());

// Routes
app.use("/access", userRoutes);
app.use("/web", serviceRoute);
app.use("/web", cartRoute);
app.use("/web", bookingRoute);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
