import ServiceModel from "../model/service.js";

// Get all services
export const getServices = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const response = await ServiceModel.find(filter);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single service
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create new service (with working hours/days)
export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      durationMinutes,
      imageUrl,
      workingHours,
      workingDays,
    } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Name and price are required fields." });
    }

    // Validate working hours
    if (workingHours && (!workingHours.start || !workingHours.end)) {
      return res
        .status(400)
        .json({ message: "Working hours must include start and end time." });
    }

    // Validate working days
    if (workingDays && !Array.isArray(workingDays)) {
      return res
        .status(400)
        .json({ message: "Working days must be an array of weekdays." });
    }

    const newService = new ServiceModel({
      name,
      description,
      price,
      durationMinutes,
      imageUrl,
      workingHours: workingHours || { start: "09:00", end: "18:00" },
      workingDays: workingDays || [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    });

    await newService.save();

    res
      .status(201)
      .json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Update service (with working hours/days)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Optional: validate working hours & days before update
    if (updateData.workingHours) {
      if (!updateData.workingHours.start || !updateData.workingHours.end) {
        return res
          .status(400)
          .json({ message: "Working hours must include start and end time." });
      }
    }

    if (updateData.workingDays && !Array.isArray(updateData.workingDays)) {
      return res
        .status(400)
        .json({ message: "Working days must be an array of weekdays." });
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
