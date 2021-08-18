import express from 'express'
import { getUser,getUsers } from '../controller/userController.js';
import { isAuthorized } from "../middlewares/middleware.js";
const router = express.Router()


router.get('/users/:usernameOrId', isAuthorized, getUser);
router.get('/users', isAuthorized, getUsers);


export default router;