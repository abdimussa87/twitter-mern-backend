import express from 'express'
import { isAuthorized } from "../middlewares/middleware.js";
import {createChat,getUsersChat,getChat,updateChat} from '../controller/chatController.js'
const router = express.Router()


router.post('/chats', isAuthorized, createChat);
router.get('/chats', isAuthorized, getUsersChat);
router.get('/chats/:id', isAuthorized, getChat);
router.put('/chats/:id', isAuthorized, updateChat);





export default router;