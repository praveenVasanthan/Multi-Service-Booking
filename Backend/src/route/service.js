import express from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../controller/serviceController.js";

const route = express.Router();

route.get("/services", getServices);
route.get("/services/:id", getServiceById);
route.post("/services", createService);
route.put("/services/:id", updateService);
route.delete("/services/:id", deleteService);

export default route;
