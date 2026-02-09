import express from "express";
import { upload, handleMulterError } from "../middlewares/multer.js";
import { uploadUserAvatar, updateUserProfile, getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.patch("/me/avatar", upload.single("avatar"), uploadUserAvatar);
router.patch("/me", updateUserProfile);
router.get("/me", getUserProfile)

/** Catch multer errors (e.g. LIMIT_FILE_SIZE, wrong field) so they return 400 instead of 500 */
router.use(handleMulterError);

export { router as userRoutes };