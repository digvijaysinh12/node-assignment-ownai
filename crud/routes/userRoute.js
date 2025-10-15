import express from 'express';
import { loginController, registerController } from '../controllers/userController.js';
import { authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register',registerController);

router.post('/login',loginController);

router.get("/",authMiddleware,(req,res) => {
    const data = req.user;
    console.log(data);

    return res.status(200).json({
        success:true,
        messsage: 'User can login and we idetify what is role of user',
        data,
    })
})

export default router;