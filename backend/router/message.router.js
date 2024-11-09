import express from "express";
import protectRoute from '../middleware/protectRoute.js'
import { getMessages, sendMessage } from "../controllers/message.controller.js";


const router =  express.Router();

router.get('/:hostel', protectRoute , getMessages)
router.post('/send/:hostel' , protectRoute , sendMessage); 


export default router;