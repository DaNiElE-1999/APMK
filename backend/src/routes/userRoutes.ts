import { Router } from "express";
import { getCurrentUser } from "../controllers/userController";
import { userAuthz } from "../middleware/authz";
const router = Router();

router.get('/me', userAuthz, getCurrentUser);

export default router;