import User from "../models/User.js";
import Commission from "../models/Commission.js";`r`nimport { notifyCommissionCreated } from "./notificationService.js";

import {
  COMMISSION_RATES,
  MAX_COMMISSION_LEVEL,
  calculateCommission, // ✅ make sure this is exported from constants/commission.js
} from "../constants/commission.js";

// ✅ Calculate commissionable amount directly from order items
const calculateCommissionableAmount = (order) => {
  let total = 0;

  for (const item of order.items) {
    if (!item.isCommissionable) {
      continue;
    }

    const commissionValue =
      item.commissionValue > 0 ? item.commissionValue : item.price;

    total += commissionValue * item.quantity;
  }

  return Number(total.toFixed(2));
};

// ✅ Create commissions for an order
export const createCommissionsForOrder = async (order) => {
  const buyer = await User.findById(order.user).select("sponsor");

  if (!buyer) {
    throw new Error("Order buyer not found");
  }

  // 🔥 Changed: no await needed
  const baseAmount = calculateCommissionableAmount(order);

  if (baseAmount <= 0) {
    return [];
  }

  const commissions = [];
  let currentSponsorId = buyer.sponsor;
  let level = 1;

  while (currentSponsorId && level <= MAX_COMMISSION_LEVEL) {
    const sponsor = await User.findById(currentSponsorId).select(
      "_id sponsor isActive"
    );

    if (!sponsor) break;

    if (sponsor.isActive) {
      const { rate, amount } = calculateCommission(baseAmount, level);

      if (amount > 0) {
        const existingCommission = await Commission.findOne({
          beneficiary: sponsor._id,
          order: order._id,
          level,
        });

        if (!existingCommission) {
          const commission = await Commission.create({
            beneficiary: sponsor._id,
            sourceUser: buyer._id,
            order: order._id,
            level,
            rate,
            baseAmount,
            amount,
            status: "PENDING",
          });

          commissions.push(commission);

          await notifyCommissionCreated({
            userId: sponsor._id,
            amount,
            level,
            orderId: order._id,
          });
        }
      }
    }

    currentSponsorId = sponsor.sponsor;
    level += 1;
  }

  return commissions;
};

