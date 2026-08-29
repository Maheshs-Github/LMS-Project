import { Notification } from "../models/notification.model.js";
import { getIO } from "../socket/index.js";

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  realtedCourse,
}) => {
  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    realtedCourse,
  });

  const io = getIO();

  io.to(`user:${recipient}`).emit("notification:new", notification);

  return notification;
};


export default createNotification;