import { Router } from "express";
import { loginUser, registerUser } from "../../controllers/userController";
const router = Router();

router.put('/register', registerUser);
router.put('/login',    loginUser);

export default router;