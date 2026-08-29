import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req?.user?.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "Notifications has been fetched successfully",
      ),
    );
});

const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const updatedNotificationRead = await Notification.updateOne(
    {
      recipient: req?.user?.id,
      _id: notificationId,
    },
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
    },
  );

  if (!updatedNotificationRead)
    throw new ApiError(404, "Notification not found");

  return res.status(
    200,
    updatedNotificationRead,
    "Notification has been successfully MArked as Read",
  );
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const updateAllNotificationRead = await notification.updateMany(
    {
      recipient: req?.user?.id,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateAllNotificationRead,
        "All Notifications has been set to Read",
      ),
    );
});

export { getMyNotifications, markAsRead, markAllAsRead };
