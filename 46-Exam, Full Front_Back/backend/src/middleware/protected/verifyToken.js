export const verifyToken = (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); 
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid or Expired Token" });
  }
};
