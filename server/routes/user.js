import express from "express"
import { 
  getUser, 
  getUserFriends, 
  getUsers,
  addRemoveFriend, 
} from "../controllers/user.js"
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* read */
router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriends)
router.post("/:id/searchUsers", verifyToken, getUsers)

/* update */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend)

export default router