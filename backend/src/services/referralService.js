import Referral from "../models/Referral.js";

export const createReferralForUser = async (user) => {
  if (!user.sponsor) {
    return null;
  }

  const existingReferral = await Referral.findOne({
    member: user._id,
  });

  if (existingReferral) {
    return existingReferral;
  }

  const referral = await Referral.create({
    sponsor: user.sponsor,
    member: user._id,
    level: 1,
    status: "ACTIVE",
  });

  return referral;
};

export const getUserReferrals = async (userId) => {
  return Referral.find({
    sponsor: userId,
  })
    .populate(
      "member",
      "firstName lastName email referralCode isActive"
    )
    .sort({ createdAt: -1 });
};

export const getUserReferralStats = async (userId) => {
  const directReferrals = await Referral.countDocuments({
    sponsor: userId,
    level: 1,
    status: "ACTIVE",
  });

  const totalReferrals = await Referral.countDocuments({
    sponsor: userId,
  });

  return {
    directReferrals,
    totalReferrals,
  };
};
