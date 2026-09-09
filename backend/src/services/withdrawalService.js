import mongoose from "mongoose";
import Withdrawal from "../models/Withdrawal.js";
import { debitWallet } from "./walletService.js";

export const createWithdrawalRequest = async ({
  userId,
  amount,
  paymentMethod,
  paymentDetails,
}) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Withdrawal amount must be greater than zero"
    );
  }

  const withdrawal =
    await Withdrawal.create({
      user: userId,
      amount,
      status: "PENDING",
      paymentMethod,
      paymentDetails,
    });

  return withdrawal;
};

export const processWithdrawal = async ({
  withdrawalId,
  status,
  adminNote,
}) => {
  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    const withdrawal =
      await Withdrawal.findOne({
        _id: withdrawalId,
        status: "PENDING",
      }).session(session);

    if (!withdrawal) {
      throw new Error(
        "Withdrawal not found or already processed"
      );
    }

    if (status === "APPROVED") {
      await debitWallet({
        userId: withdrawal.user,
        amount: withdrawal.amount,
        type: "WITHDRAWAL",
        description:
          "Withdrawal approved",
        reference: withdrawal._id,
        session,
      });
    }

    withdrawal.status = status;

    if (adminNote) {
      withdrawal.adminNote = adminNote;
    }

    await withdrawal.save({ session });

    await session.commitTransaction();

    return withdrawal;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};