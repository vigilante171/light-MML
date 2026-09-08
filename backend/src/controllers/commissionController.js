import Commission from "../models/Commission.js";

// ✅ Get commissions for logged-in user
export const getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({
      beneficiary: req.user.userId,
    })
      .populate("sourceUser", "firstName lastName")
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: commissions.length,
      commissions,
    });
  } catch (error) {
    console.error("Get commissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch commissions",
    });
  }
};

// ✅ Get commission summary for logged-in user
export const getMyCommissionSummary = async (req, res) => {
  try {
    const result = await Commission.aggregate([
      {
        $match: {
          beneficiary: req.user.userId,
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      pending: 0,
      approved: 0,
      cancelled: 0,
      total: 0,
    };

    for (const item of result) {
      const status = item._id.toLowerCase();
      if (status === "pending") summary.pending = item.totalAmount;
      if (status === "approved") summary.approved = item.totalAmount;
      if (status === "cancelled") summary.cancelled = item.totalAmount;
    }

    summary.total = summary.pending + summary.approved + summary.cancelled;

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Get commission summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate commission summary",
    });
  }
};

// ✅ Admin: Get all pending commissions
export const getAllPendingCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ status: "PENDING" })
      .populate("beneficiary", "firstName lastName email")
      .populate("sourceUser", "firstName lastName email")
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: commissions.length,
      commissions,
    });
  } catch (error) {
    console.error("Get pending commissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending commissions",
    });
  }
};

// ✅ Admin: Approve a commission
export const approveCommission = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "Commission not found",
      });
    }

    if (commission.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending commissions can be approved",
      });
    }

    commission.status = "APPROVED";
    await commission.save();

    return res.status(200).json({
      success: true,
      message: "Commission approved successfully",
      commission,
    });
  } catch (error) {
    console.error("Approve commission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve commission",
    });
  }
};
