import { Router } from "express";
import { booksTrackingController, studentProfileController } from "../controllers/studentController.js";

const studentRouter = Router();

studentRouter.get("/profile", studentProfileController);
studentRouter.get("/track", booksTrackingController);

export default studentRouter;