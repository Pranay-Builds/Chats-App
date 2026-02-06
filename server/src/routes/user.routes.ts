import express from "express";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


router.patch("/me/upload", upload.single("avatar"));


export { router as userRoutes };