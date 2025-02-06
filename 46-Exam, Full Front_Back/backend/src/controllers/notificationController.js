import Notification from "../models/notification.js";


// Bildiriş yarat
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      user: req.user._id,
      type: req.body.type,
      message: req.body.message,
    });
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bildirişləri əldə et
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};