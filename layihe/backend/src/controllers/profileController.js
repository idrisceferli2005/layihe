import User from "../models/userModel.js";


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate("posts", "content image") 
    .populate("followers", "username")
    .populate("following", "username")
    if (!user) {
      return res.status(404).json({ message: `User with ID ${req.params.id} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;

    if (req.file) {
      user.image = `images/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};