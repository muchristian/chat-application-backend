import express from "express";

import {
  createChatRoom,
  getChatRoomOfUser,
  getChatRoomOfUsers,
  bulkDeleteChatRooms,
} from "../controllers/chatRoom.js";

const router = express.Router();

router.post("/", createChatRoom);
router.get("/:userId", getChatRoomOfUser);
router.get("/:firstUserId/:secondUserId", getChatRoomOfUsers);
router.delete("/delete-all", bulkDeleteChatRooms);

export default router;
