import User from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate("posts") 
    .populate("followers")
    .populate("following");
    if (!user) {
      return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
    }
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.image = req.body.image || user.image;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
