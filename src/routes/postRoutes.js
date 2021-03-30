import express from 'express'
import { createPost, getPosts } from "../controller/postController.js";
import { isAuthorized } from "../middlewares/middleware.js";
const router = express.Router()

router.post('/posts', isAuthorized, createPost);
router.get('/posts', isAuthorized, getPosts);

export default router;