import Withdrawal from "../models/Withdrawal.js";

import {
  createWithdrawalRequest,
  processWithdrawal,
} from "../services/withdrawalService.js";

export const requestWithdrawal = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      paymentDetails,
    } = req.body;

    if (
      !amount ||
      !paymentMethod ||
      !paymentDetails
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount, payment method and payment details are required",
      });
    }

    const withdrawal =
      await createWithdrawalRequest({
        userId: req.user.userId,
        amount: Number(amount),
        paymentMethod,
        paymentDetails,
      });

    return res.status(201).json({
      success: true,
      message:
        "Withdrawal request created successfully",
      withdrawal,
    });
  } catch (error) {
    console.error(
      "Request withdrawal error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      user: req.user.userId,
    })
      .select("-paymentDetails")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    console.error(
      "Get withdrawals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawals",
    });
  }
};

export const getPendingWithdrawals = async (
  req,
  res
) => {
  try {
    const withdrawals =
      await Withdrawal.find({
        status: "PENDING",
      })
        .select("-paymentDetails")
        .populate(
          "user",
          "firstName lastName email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    console.error(
      "Get pending withdrawals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch pending withdrawals",
    });
  }
};

export const updateWithdrawalStatus = async (
  req,
  res
) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "APPROVED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal status",
      });
    }

    const withdrawal =
      await processWithdrawal({
        withdrawalId: req.params.id,
        status,
        adminNote,
      });

    return res.status(200).json({
      success: true,
      message:
        "Withdrawal status updated successfully",
      withdrawal,
    });
  } catch (error) {
    console.error(
      "Update withdrawal status error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};