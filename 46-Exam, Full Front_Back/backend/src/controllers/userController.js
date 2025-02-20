import user from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { recieveMail } from "../middleware/mailer/mailer.js";
import jwt from "jsonwebtoken";
import RegisterValidationSchema from "../middleware/validation/RegisterValidation.js";
import LoginValidationSchema from "../middleware/validation/LoginValidation.js";
import ForgotValidationSchema from "../middleware/validation/ForgotValidation.js";
import ResetValidationSchema from "../middleware/validation/ResetValidation.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const { filename } = req.file;
    const imageUrl = `images/${filename}`.replace(/\\/g, "/");

    const { error } = RegisterValidationSchema.validate({
      name,
      username,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await user.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // İlk istifadəçi olub-olmamasını yoxlamaq
    const totalUsers = await user.countDocuments();
    const isAdmin = totalUsers === 0;  // Əgər 0 istifadəçi varsa, admin təyin et

    const newUser = new user({
      image: imageUrl,
      name,
      username,
      email,
      password: hashedPassword,
      isAdmin,  // İlk istifadəçi admin olacaq
    });

    await newUser.save();

    const token = generateToken(newUser._id, res);

    const confirmLink = `${process.env.SERVER_LINK}/auth/verify/${token}`;

    recieveMail(newUser, confirmLink);

    return res.status(201).json({
      message: "User created successfully",
      newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await user.findById(req.user.id).select("-password"); 
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(currentUser); 
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updatedVerify = await user.findByIdAndUpdate(
      { _id: decoded.id },
      { isVerified: true }
    );

    if (updatedVerify) {
      return res.redirect(`${process.env.CLIENT_LINK}/login`);
    }
  } catch (error) {
    return res.status(400).json({ message: "Token not valid or expaired in" });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { error } = LoginValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await User.findOne({ username });

    if (!existUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Username or Password wrong" });
    }

 
    existUser.isLogined = true;
    await existUser.save();

    generateToken(existUser._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      existUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await User.findByIdAndUpdate(userId, { isLogined: false });

    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = ForgotValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await user.findOne({ email });

    if (!existUser) return res.status(404).json({ message: "User not found" });

    const resetToken = generateToken(existUser._id, res);

    const resetLink = `${process.env.CLIENT_LINK}/resetpassword/${resetToken}`;

    recieveMail(existUser, resetLink);

    return res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const { error } = ResetValidationSchema.validate({
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existUser = await user.findById(decoded.id);

    if (!existUser) {
      return res.status(400).json({ message: "Token not valid or expaired" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    existUser.password = hashedPassword;

    await existUser.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { filename } = req.file;
    const imageUrl = `uploads/${filename}`.replace(/\\/g, "/");


    const newPost = new Post({
      user: req.user.id, 
      content,
      image: imageUrl,
    });

    await newPost.save();


    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Post yaradıldı",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  console.log("User ID to delete:", req.params.id); 
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { userId } = req.params; // Hedef istifadəçinin ID-si

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Düzgün ID deyil!" });
    }

    const userToBeAdmin = await User.findById(userId);

    if (!userToBeAdmin) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı!" });
    }

    // `isAdmin` dəyərini tərsinə çeviririk
    userToBeAdmin.isAdmin = !userToBeAdmin.isAdmin;
    await userToBeAdmin.save();

    return res.status(200).json({
      message: `İstifadəçinin admin statusu ${userToBeAdmin.isAdmin ? 'təmin edildi' : 'çıxarıldı'}!`,
      user: userToBeAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const banUser = async (req, res) => {
  const { userId } = req.params;  

  try {

   

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.isBanned = true;  
    await user.save();  

    res.status(200).json({ message: "User banned", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
