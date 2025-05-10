import { Router } from "express";
import { getCurrentUser } from "../controllers/userController";
import { protect } from "../middleware/authz";
const router = Router();

router.get('/me', protect, getCurrentUser);

export default router;