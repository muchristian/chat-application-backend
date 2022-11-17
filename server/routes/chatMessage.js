import express from "express";

import {
  createMessage,
  getMessages,
  bulkDeleteChatMessages,
} from "../controllers/chatMessage.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatRoomId", getMessages);
router.delete("/delete-all", bulkDeleteChatMessages);

export default router;
