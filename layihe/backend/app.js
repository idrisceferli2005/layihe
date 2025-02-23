import express from "express";
import "dotenv/config";
import cors from "cors";
import "./src/db/dbConnection.js";
import productRouter from "./src/routes/productRouter.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import friendRoutes from "./src/routes/friendRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import postcommentRouter from "./src/routes/postCommentRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import searchRouter from "./src/routes/searchRoutes.js";
const port = process.env.PORT || 5001;
const app = express();




 
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true })); 
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));


app.use("/api/products", productRouter);
app.use("/auth", userRouter);
app.use("/api/friends", friendRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/posts", postcommentRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/search", searchRouter);
app.use("/images", express.static("src/images"));
app.use("/api/users", userRouter);



app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});