import {
  getDirectMembers,
  getNetworkTree,
  getNetworkSummary,
} from "../services/genealogyService.js";

export const getMyDirectMembers = async (req, res) => {
  try {
    const members = await getDirectMembers(req.user.userId);

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get direct members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch direct members",
    });
  }
};

export const getMyNetworkTree = async (req, res) => {
  try {
    const depth = Math.min(
      Math.max(Number(req.query.depth) || 5, 1),
      10
    );

    const tree = await getNetworkTree(
      req.user.userId,
      depth
    );

    return res.status(200).json({
      success: true,
      depth,
      tree,
    });
  } catch (error) {
    console.error("Get network tree error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch network tree",
    });
  }
};

export const getMyNetworkSummary = async (req, res) => {
  try {
    const depth = Math.min(
      Math.max(Number(req.query.depth) || 5, 1),
      10
    );

    const summary = await getNetworkSummary(
      req.user.userId,
      depth
    );

    return res.status(200).json({
      success: true,
      depth,
      summary,
    });
  } catch (error) {
    console.error("Get network summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch network summary",
    });
  }
};