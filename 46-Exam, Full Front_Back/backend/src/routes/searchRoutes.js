import express from "express";
import { searchPosts, searchUsers } from "../controllers/searchController.js";


const searchRouter = express.Router();

searchRouter.get("/users", searchUsers);
searchRouter.get("/posts", searchPosts);

export default searchRouter;