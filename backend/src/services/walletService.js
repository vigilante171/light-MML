import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getOrCreateWallet = async (
  userId,
  session = null
) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  };

  if (session) {
    options.session = session;
  }

  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    {
      $setOnInsert: {
        user: userId,
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
      },
    },
    options
  );

  return wallet;
};

export const creditWallet = async ({
  userId,
  amount,
  type = "COMMISSION",
  description,
  reference = null,
  session = null,
}) => {
  if (amount <= 0) {
    throw new Error(
      "Credit amount must be greater than zero"
    );
  }

  const wallet = await getOrCreateWallet(
    userId,
    session
  );

  const updateOptions = {};

  if (session) {
    updateOptions.session = session;
  }

  const updatedWallet =
    await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      {
        $inc: {
          availableBalance: amount,
          totalEarned: amount,
        },
      },
      {
        new: true,
        ...updateOptions,
      }
    );

  await Transaction.create(
    [
      {
        user: userId,
        type,
        amount,
        direction: "CREDIT",
        description,
        reference,
      },
    ],
    session ? { session } : undefined
  );

  return updatedWallet;
};

export const debitWallet = async ({
  userId,
  amount,
  type = "WITHDRAWAL",
  description,
  reference = null,
  session = null,
}) => {
  if (amount <= 0) {
    throw new Error(
      "Debit amount must be greater than zero"
    );
  }

  const options = {};

  if (session) {
    options.session = session;
  }

  const wallet =
    await Wallet.findOneAndUpdate(
      {
        user: userId,
        availableBalance: { $gte: amount },
      },
      {
        $inc: {
          availableBalance: -amount,
        },
      },
      {
        new: true,
        ...options,
      }
    );

  if (!wallet) {
    throw new Error("Insufficient wallet balance");
  }

  await Transaction.create(
    [
      {
        user: userId,
        type,
        amount,
        direction: "DEBIT",
        description,
        reference,
      },
    ],
    session ? { session } : undefined
  );

  return wallet;
};