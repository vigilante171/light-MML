import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications =
      await getUserNotifications(req.user.userId);

    const unreadCount =
      notifications.filter(
        (notification) => !notification.isRead
      ).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification =
      await markNotificationAsRead({
        notificationId: req.params.id,
        userId: req.user.userId,
      });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result =
      await markAllNotificationsAsRead(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark notifications as read",
    });
  }
};
