import Commission from "../models/Commission.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";`rn`
import { notifyCommissionApproved } from "../services/notificationService.js";

// ✅ Get commissions for logged-in user
export const getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({
      beneficiary: req.user.userId,
    })
      .populate("sourceUser", "firstName lastName")
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: commissions.length,
      commissions,
    });
  } catch (error) {
    console.error("Get commissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch commissions",
    });
  }
};

// ✅ Get commission summary for logged-in user
export const getMyCommissionSummary = async (req, res) => {
  try {
    const result = await Commission.aggregate([
      { $match: { beneficiary: req.user.userId } },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { pending: 0, approved: 0, cancelled: 0, total: 0 };

    for (const item of result) {
      const status = item._id.toLowerCase();
      if (status === "pending") summary.pending = item.totalAmount;
      if (status === "approved") summary.approved = item.totalAmount;
      if (status === "cancelled") summary.cancelled = item.totalAmount;
    }

    summary.total = summary.pending + summary.approved + summary.cancelled;

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Get commission summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate commission summary",
    });
  }
};

// ✅ Admin: Get all pending commissions
export const getAllPendingCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ status: "PENDING" })
      .populate("beneficiary", "firstName lastName email")
      .populate("sourceUser", "firstName lastName email")
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: commissions.length,
      commissions,
    });
  } catch (error) {
    console.error("Get pending commissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending commissions",
    });
  }
};

// ✅ Admin: Approve commission and credit wallet
export const approveCommission = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const commission =
      await Commission.findOneAndUpdate(
        {
          _id: req.params.id,
          status: "PENDING",
        },
        {
          $set: {
            status: "APPROVED",
          },
        },
        {
          new: true,
          session,
        }
      );

    if (!commission) {
      throw new Error(
        "Commission not found or already processed"
      );
    }

    const wallet = await Wallet.findOneAndUpdate(
      {
        user: commission.beneficiary,
      },
      {
        $setOnInsert: {
          user: commission.beneficiary,
          availableBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session,
      }
    );

    const updatedWallet =
      await Wallet.findOneAndUpdate(
        {
          _id: wallet._id,
        },
        {
          $inc: {
            availableBalance: commission.amount,
            totalEarned: commission.amount,
          },
        },
        {
          new: true,
          session,
        }
      );

    await Transaction.create(
      [
        {
          user: commission.beneficiary,
          type: "COMMISSION",
          amount: commission.amount,
          direction: "CREDIT",
          description: `Commission for order ${commission.order}`,
          reference: commission._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await notifyCommissionApproved({
      userId: commission.beneficiary,
      amount: commission.amount,
    });

    return res.status(200).json({
      success: true,
      message:
        "Commission approved and wallet credited",
      commission,
      wallet: updatedWallet,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(
      "Approve commission error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

