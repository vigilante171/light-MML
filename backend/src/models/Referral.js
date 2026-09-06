import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    level: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

referralSchema.index({ sponsor: 1 });
referralSchema.index({ member: 1 }, { unique: true });

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;
