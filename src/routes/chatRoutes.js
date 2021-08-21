import express from 'express'
import { isAuthorized } from "../middlewares/middleware.js";
import {createChat,getUsersChat} from '../controller/chatController.js'
const router = express.Router()


router.post('/chats', isAuthorized, createChat);
router.get('/chats', isAuthorized, getUsersChat);



export default router;