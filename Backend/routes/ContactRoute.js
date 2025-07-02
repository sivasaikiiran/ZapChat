import express from "express";
const router = express.Router();
import { getContact } from "../controllers/ContactController.js";
import verifyToken from "../middlewares/VerifyToken.js";



router.post('/getContact', verifyToken, getContact);












export default router;