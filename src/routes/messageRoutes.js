import express from 'express'
import { isAuthorized } from "../middlewares/middleware.js";
import {createMessage, getChatMessages} from "../controller/messageController.js"
const router = express.Router()

router.post('/messages', isAuthorized, createMessage);
router.get('/chatMessages/:chatId', isAuthorized, getChatMessages);





export default router;