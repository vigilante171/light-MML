import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { createCommissionsForOrder } from "../services/commissionService.js";

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
  isCommissionable: product.isCommissionable,
  commissionValue: product.commissionValue,
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

// ✅ New functions

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("items.product", "name images");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("items.product", "name images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }
};

// ✅ Admin-level functions

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name images");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.status;

    order.status = status;

    if (status === "PAID") {
      order.paymentStatus = "PAID";
    }

    if (status === "REFUNDED") {
      order.paymentStatus = "REFUNDED";
    }

    await order.save();

    let commissions = [];

    if (
      status === "PAID" &&
      previousStatus !== "PAID"
    ) {
      commissions = await createCommissionsForOrder(order);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
      commissionsCreated: commissions.length,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "PAID") {
      order.paymentStatus = "PAID";
    }

    if (status === "REFUNDED") {
      order.paymentStatus = "REFUNDED";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update order status",
    });
  }

