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

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      image: imageUrl,
      name,
      username,
      email,
      password: hasedPassword,
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

    const existUser = await user.findOne({ username: username });

    if (!existUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Username or Password wrong" });
    }

    generateToken(existUser._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      existUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "User logged out successfully" });
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
    const { filename } = req.file; // Yüklənmiş faylın adı
    const imageUrl = `uploads/${filename}`.replace(/\\/g, "/");

    // Yeni postu yarat
    const newPost = new Post({
      user: req.user.id, // Giriş edən istifadəçinin ID-sini req.user-dən al
      content,
      image: imageUrl, // Faylın URL-ni saxla
    });

    await newPost.save();

    // İstifadəçinin posts array-ını yenilə
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
