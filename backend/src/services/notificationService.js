import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!title || !message) {
    throw new Error(
      "Notification title and message are required"
    );
  }

  const allowedTypes = [
    "SYSTEM",
    "ORDER",
    "REFERRAL",
    "COMMISSION",
    "WITHDRAWAL",
  ];

  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid notification type");
  }

  return Notification.create({
    user: userId,
    title,
    message,
    type,
    isRead: false,
  });
};

export const createAdminNotification = async ({
  userId,
  title,
  message,
}) => {
  return createNotification({
    userId,
    title,
    message,
    type: "SYSTEM",
  });
};

export const getUserNotifications = async (userId) => {
  return Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

export const markNotificationAsRead = async ({
  notificationId,
  userId,
}) => {
  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      }
    );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const markAllNotificationsAsRead = async (
  userId
) => {
  return Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};
