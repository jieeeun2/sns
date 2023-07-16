import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  comments,
  deleteComments
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* read */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* update */
router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:postId/comments", verifyToken, comments);

/* delete */
router.delete("/:postId/:commentId/deleteComments", verifyToken, deleteComments)


export default router;
