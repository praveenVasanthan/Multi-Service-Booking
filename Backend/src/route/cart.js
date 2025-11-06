import express from "express";
import {
  addCart,
  deleteCart,
  getCartsByUser,
  updateCart,
} from "../controller/cartController.js";
import authMiddleware from "../middilwares/authMiddleware.js";

const route = express.Router();

route.get("/carts", authMiddleware, getCartsByUser);
route.post("/carts", authMiddleware, addCart);
route.put("/carts/:id", authMiddleware, updateCart);
route.delete("/carts/:id", authMiddleware, deleteCart);

export default route;
