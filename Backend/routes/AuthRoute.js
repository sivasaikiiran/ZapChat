import express from "express"
const router = express.Router();
import { loginController, signupController, getUserInfoController, uploadImage, updateProfile, logout } from "../controllers/AuthController.js";
import verifyToken from "../middlewares/VerifyToken.js";


router.get('/getUserInfo', verifyToken, getUserInfoController);
router.post('/login', loginController);
router.post('/signup', signupController);
router.post('/uploadImage', verifyToken, uploadImage)
router.post('/logout', logout);
router.patch('/updateProfile', verifyToken, updateProfile)




export default router;