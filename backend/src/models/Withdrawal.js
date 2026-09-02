import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    paymentDetails: {
      type: String,
      required: true,
      select: false,
    },

    adminNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model(
  "Withdrawal",
  withdrawalSchema
);

export default Withdrawal;