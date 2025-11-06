import cartModel from "../model/cartModel.js";

// Get cart items by user ID
export const getCartsByUser = async (req, res) => {
  try {
    const userId = req.id.id;
    const carts = await cartModel.find({ user: userId }).populate("service");
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error });
  }
};

// Add to cart
export const addCart = async (req, res) => {
  try {
    const userId = req.id.id;
    const { service, quantity } = req.body;

    if (!service) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    // Check if the user already has this service in their cart
    const existingCartItem = await cartModel.findOne({ user: userId, service });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;
      await existingCartItem.save();
      return res
        .status(200)
        .json({ message: "Quantity updated", data: existingCartItem });
    }

    const newCartItem = await cartModel.create({
      user: userId,
      service,
      quantity: quantity || 1,
    });

    res
      .status(201)
      .json({ message: "Service added to cart", data: newCartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// Update cart quantity (user can only update their own cart)
export const updateCart = async (req, res) => {
  try {
    const userId = req.id.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await cartModel.findOneAndUpdate(
      { _id: id, user: userId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item updated", data: cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

// Delete cart item (user can only delete their own cart item)
export const deleteCart = async (req, res) => {
  try {
    const userId = req.id.id;
    const { id } = req.params;

    const cartItem = await cartModel.findOne({ _id: id, user: userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Failed to delete cart item", error });
  }
};
