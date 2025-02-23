import express from "express";
// import verifyToken from "../middleware/protected/verifyToken.js";

import {
  addProduct,
  deleteProduct,
  getProducts,
  searchProduct,
} from "../controllers/productController.js";
import upload from "../upload/upload.js";

const productRouter = express.Router();

// productRouter.use(verifyToken);

productRouter.post("/", upload.single("image"), addProduct);
productRouter.get("/", getProducts);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/search/:title", searchProduct);

export default productRouter;
