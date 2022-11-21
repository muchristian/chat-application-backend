import express from "express";

import {
  register,
  getAllUsers,
  getUser,
  bulkDeleteUsers,
  refreshToken,
  login,
} from "../controllers/user.js";
import { access, refresh } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", access, getAllUsers);
router.get("/:userId", access, getUser);
router.post("/register", register);
router.post("/login", login);
router.delete("/delete-all", bulkDeleteUsers);
router.get("/refresh-token", refresh, refreshToken);

export default router;
