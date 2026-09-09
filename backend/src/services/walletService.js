import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getOrCreateWallet = async (userId, session = null) => {
  const query = Wallet.findOne({ user: userId });

  if (session) {
    query.session(session);
  }

  let wallet = await query;

  if (!wallet) {
    const wallets = await Wallet.create(
      [
        {
          user: userId,
          availableBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
        },
      ],
      session ? { session } : {}
    );

    wallet = wallets[0];
  }

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
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Credit amount must be greater than zero"
    );
  }

  const wallet = await getOrCreateWallet(
    userId,
    session
  );

  wallet.availableBalance = Number(
    (
      wallet.availableBalance + amount
    ).toFixed(2)
  );

  wallet.totalEarned = Number(
    (
      wallet.totalEarned + amount
    ).toFixed(2)
  );

  await wallet.save(
    session ? { session } : {}
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
    session ? { session } : {}
  );

  return wallet;
};

export const debitWallet = async ({
  userId,
  amount,
  type = "WITHDRAWAL",
  description,
  reference = null,
  session = null,
}) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Debit amount must be greater than zero"
    );
  }

  const wallet = await getOrCreateWallet(
    userId,
    session
  );

  if (wallet.availableBalance < amount) {
    throw new Error(
      "Insufficient wallet balance"
    );
  }

  wallet.availableBalance = Number(
    (
      wallet.availableBalance - amount
    ).toFixed(2)
  );

  await wallet.save(
    session ? { session } : {}
  );

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
    session ? { session } : {}
  );

  return wallet;
};