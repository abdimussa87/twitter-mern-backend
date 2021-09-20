import express from 'express'
import { isAuthorized } from "../middlewares/middleware.js";
import {createMessage} from "../controller/messageController.js"
const router = express.Router()

router.post('/messages', isAuthorized, createMessage);
// router.get('/messages', isAuthorized, getUsersChat);
// router.get('/chats/:id', isAuthorized, getChat);
// router.put('/chats/:id', isAuthorized, updateChat);





export default router;