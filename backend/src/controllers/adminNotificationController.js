import {
  createAdminNotification,
} from "../services/notificationService.js";

export const sendAdminNotification = async (
  req,
  res
) => {
  try {
    const {
      userId,
      title,
      message,
    } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "userId, title and message are required",
      });
    }

    const notification =
      await createAdminNotification({
        userId,
        title,
        message,
      });

    return res.status(201).json({
      success: true,
      message:
        "Notification sent successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "Send admin notification error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
