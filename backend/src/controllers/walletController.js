import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { getOrCreateWallet } from "../services/walletService.js";

export const getMyWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("Get wallet error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
    });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error(
      "Get transactions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};