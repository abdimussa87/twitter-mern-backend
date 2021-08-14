import express from 'express'
import { getUser } from '../controller/userController.js';
import { isAuthorized } from "../middlewares/middleware.js";
const router = express.Router()


router.get('/users/:usernameOrId', isAuthorized, getUser);

export default router;