import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const checkout = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        throw new Error("A product in your cart no longer exists");
      }

      if (!product.isActive) {
        throw new Error(`Product "${product.name}" is no longer available`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for "${product.name}". Available: ${product.stock}`
        );
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      totalAmount += subtotal;
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
      ],
      { session }
    );

    for (const item of cart.items) {
      const result = await Product.updateOne(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        { session }
      );

      if (result.modifiedCount !== 1) {
        throw new Error(
          `Stock changed while processing "${item.product.name}". Please try again.`
        );
      }
    }

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Checkout error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Checkout failed",
    });
  } finally {
    await session.endSession();
  }
};