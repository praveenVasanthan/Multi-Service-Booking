import BookingModel from "../model/booking.js";
import ServiceModel from "../model/service.js";
import CartModel from "../model/cartModel.js";
import dayjs from "dayjs";

// get slots by date and service id
export const getBookedSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res
        .status(400)
        .json({ message: "Service ID and date are required" });
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const bookings = await BookingModel.find({ service: serviceId, date });

    const duration = service.duration || 60;
    const bookedTimes = [];

    bookings.forEach((b) => {
      const start = b.time;
      const [h, m] = start.split(":").map(Number);
      const startMinutes = h * 60 + m;
      const endMinutes = startMinutes + duration;

      for (let t = startMinutes; t < endMinutes; t += 30) {
        const hr = Math.floor(t / 60)
          .toString()
          .padStart(2, "0");
        const min = (t % 60).toString().padStart(2, "0");
        bookedTimes.push(`${hr}:${min}`);
      }
    });

    const uniqueTimes = [...new Set(bookedTimes)];

    res.status(200).json({ bookedTimes: uniqueTimes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booked slots" });
  }
};

// Add a new booking
export const addBooking = async (req, res) => {
  try {
    const { serviceId, cartId, date, time, name, email, phone } = req.body;

    if (!serviceId && !cartId) {
      return res
        .status(400)
        .json({ message: "Service ID or Cart ID is required" });
    }

    let serviceData;
    let quantity = 1;
    let price = 0;

    if (serviceId) {
      const service = await ServiceModel.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      serviceData = service;
      price = service.price;
    }

    if (cartId) {
      const cart = await CartModel.findById(cartId).populate("service");
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      serviceData = cart.service;
      quantity = cart.quantity;
      price = cart.service.price * cart.quantity;
    }

    // Validate working days
    const selectedDay = dayjs(date).format("dddd"); // e.g., Monday
    if (
      serviceData.workingDays &&
      serviceData.workingDays.length &&
      !serviceData.workingDays.includes(selectedDay)
    ) {
      return res
        .status(400)
        .json({ message: `Service is not available on ${selectedDay}` });
    }

    // Validate working hours
    if (serviceData.workingHours) {
      const selectedTime = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");
      const startTime = dayjs(
        `${date} ${serviceData.workingHours.start}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(
        `${date} ${serviceData.workingHours.end}`,
        "YYYY-MM-DD HH:mm"
      );

      if (selectedTime.isBefore(startTime) || selectedTime.isAfter(endTime)) {
        return res.status(400).json({
          message: `Selected time is outside working hours (${serviceData.workingHours.start} - ${serviceData.workingHours.end})`,
        });
      }
    }

    // Check if slot already booked
    const existingBooking = await BookingModel.findOne({
      service: serviceData._id,
      date,
      time,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Create booking
    const booking = new BookingModel({
      service: serviceData._id,
      customer: { name, email, phone },
      date,
      time,
      quantity,
      price,
      workingHours: serviceData.workingHours || undefined,
      workingDays: serviceData.workingDays || undefined,
    });

    await booking.save();

    // Delete cart if used
    if (cartId) {
      await CartModel.findByIdAndDelete(cartId);
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate({
        path: "service",
        select: "name",
      })
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => ({
      _id: b._id,
      customerName: b.customer.name,
      customerPhone: b.customer.phone,
      serviceName: b.service?.name || "Unknown Service",
      date: b.date,
      time: b.time,
      quantity: b.quantity,
      price: b.price,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.findById(id).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
