import User from "../models/User.js";

import {
  getUserReferrals,
  getUserReferralStats,
} from "../services/referralService.js";

export const getMyReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "firstName lastName referralCode"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      referralCode: user.referralCode,
      referralLink: `http://localhost:5173/register?ref=${user.referralCode}`,
    });
  } catch (error) {
    console.error("Get referral code error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get referral information",
    });
  }
};

export const getMyReferrals = async (req, res) => {
  try {
    const referrals = await getUserReferrals(req.user.userId);

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error("Get referrals error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referrals",
    });
  }
};

export const getMyReferralStats = async (req, res) => {
  try {
    const stats = await getUserReferralStats(req.user.userId);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get referral stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral statistics",
    });
  }
};
