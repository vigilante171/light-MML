import Withdrawal from "../models/Withdrawal.js";
import { debitWallet } from "./walletService.js";

export const createWithdrawalRequest = async ({
  userId,
  amount,
  paymentMethod,
  paymentDetails,
}) => {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be greater than zero");
  }

  const withdrawal = await Withdrawal.create({
    user: userId,
    amount,
    status: "PENDING",
    paymentMethod,
    paymentDetails,
  });

  return withdrawal;
};

export const processWithdrawal = async ({ withdrawalId, status, adminNote }) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  if (withdrawal.status !== "PENDING") {
    throw new Error("Only pending withdrawals can be processed");
  }

  let wallet = null;

  if (status === "APPROVED") {
    wallet = await debitWallet({
      userId: withdrawal.user,
      amount: withdrawal.amount,
      type: "WITHDRAWAL",
      description: "Withdrawal approved",
      reference: withdrawal._id,
    });
  }

  withdrawal.status = status;

  if (adminNote) {
    withdrawal.adminNote = adminNote;
  }

  await withdrawal.save();

  // ✅ Return both withdrawal and wallet
  return { withdrawal, wallet };
};

// ✅ Controller handler for updating withdrawal status
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const result = await processWithdrawal({
      withdrawalId: req.params.id,
      status,
      adminNote,
    });

    return res.status(200).json({
      success: true,
      message: "Withdrawal status updated successfully",
      withdrawal: result.withdrawal,
      wallet: result.wallet,
    });
  } catch (error) {
    console.error("Update withdrawal status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update withdrawal status",
    });
  }
};
