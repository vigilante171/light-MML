import User from "../models/User.js";
import Referral from "../models/Referral.js";

export const getDirectMembers = async (userId) => {
  return User.find({
    sponsor: userId,
  })
    .select("firstName lastName email referralCode sponsor isActive createdAt")
    .sort({ createdAt: -1 });
};

export const getNetworkTree = async (userId, maxDepth = 5) => {
  const rootUser = await User.findById(userId)
    .select("firstName lastName email referralCode sponsor isActive");

  if (!rootUser) {
    throw new Error("User not found");
  }

  const buildTree = async (parentId, level) => {
    if (level > maxDepth) {
      return [];
    }

    const members = await User.find({
      sponsor: parentId,
    })
      .select("firstName lastName email referralCode sponsor isActive createdAt")
      .sort({ createdAt: -1 });

    const result = [];

    for (const member of members) {
      result.push({
        user: member,
        level,
        children: await buildTree(member._id, level + 1),
      });
    }

    return result;
  };

  return {
    user: rootUser,
    network: await buildTree(userId, 1),
  };
};

export const getNetworkSummary = async (userId, maxDepth = 5) => {
  const levels = {};

  const collectMembers = async (parentId, level) => {
    if (level > maxDepth) {
      return;
    }

    const members = await User.find({
      sponsor: parentId,
    }).select("_id");

    if (!levels[level]) {
      levels[level] = 0;
    }

    levels[level] += members.length;

    for (const member of members) {
      await collectMembers(member._id, level + 1);
    }
  };

  await collectMembers(userId, 1);

  let totalMembers = 0;

  for (const count of Object.values(levels)) {
    totalMembers += count;
  }

  return {
    levels,
    totalMembers,
  };
};