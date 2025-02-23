import User from "../models/userModel.js";
export const followUser = async (req, res) => {
  try {
    const { userId, followId } = req.body;

    if (userId === followId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(followId);
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (currentUser.following.includes(followId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    await User.findByIdAndUpdate(userId, { $push: { following: followId } }, { new: true });
    await User.findByIdAndUpdate(followId, { $push: { followers: userId } }, { new: true });

    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const unfollowUser = async (req, res) => {
  try {
    const { userId, unfollowId } = req.body;

    const userToUnfollow = await User.findById(unfollowId);
    const currentUser = await User.findById(userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(unfollowId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== unfollowId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

    await currentUser.save();
    await userToUnfollow.save();

    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};