import express from "express";
import {
  addBooking,
  getBookedSlots,
  getBookingById,
  getBookings,
} from "../controller/bookingController.js";

const route = express.Router();

route.get("/bookings", getBookings);
route.get("/booking/slots", getBookedSlots);
route.post("/booking", addBooking);
route.get("/booking/:id", getBookingById);

export default route;
