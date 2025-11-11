import { Router } from "express";
// import authRouter from "./authRoutes.js";
import adminRouter from "./adminRoutes.js";
import studentRouter from "./studentRoutes.js";
import { verifyToken } from "../middleware/verify.js";

const router = Router();

// router.use("/auth", authRouter);
router.use("/admin", verifyToken, adminRouter);
router.use("/student", verifyToken, studentRouter);

export default router;