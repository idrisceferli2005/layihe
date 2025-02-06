import User from "../models/userModel.js";

// Dostluq sorğusu göndər
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dostluq sorğusunu qəbul et
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);
    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};