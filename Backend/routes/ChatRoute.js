import express from "express"
const router = express.Router();
import { getChats, addContact, getAllContacts, removeContact, createChannel, getAllChannels, getChannelChats, removeChannel, removeChannelMember } from "../controllers/ChatController.js"
import verifyToken from "../middlewares/VerifyToken.js";


router.post('/getChats', verifyToken, getChats);
router.post('/getChannelChats', verifyToken, getChannelChats);
router.post('/addContact', verifyToken, addContact);
router.post('/createChannel', verifyToken, createChannel);
router.post('/removeContact', verifyToken, removeContact);
router.post('/removeChannel', verifyToken, removeChannel);
router.post('/removeChannelMember', verifyToken, removeChannelMember);
router.post('/getContacts', verifyToken, getAllContacts);
router.post('/getChannels', verifyToken, getAllChannels);




export default router;