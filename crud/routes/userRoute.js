import express from 'express';
import { getUserDetailsController, loginController, registerController, searchUserController } from '../controllers/userController.js';
import { authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register',registerController);

router.post('/login',loginController);

router.get("/list",authMiddleware,searchUserController);

router.get("/:id",authMiddleware,getUserDetailsController);

export default router;