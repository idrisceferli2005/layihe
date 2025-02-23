import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const friendProtect = async (req, res, next) => {
  let token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    if (!decoded.id) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); 
} else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};