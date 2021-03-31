import express from 'express'
import { createPost, getPosts, likePost, unlikePost } from "../controller/postController.js";
import { isAuthorized } from "../middlewares/middleware.js";
const router = express.Router()

router.post('/posts', isAuthorized, createPost);
router.get('/posts', isAuthorized, getPosts);
router.put('/posts/:id/like', isAuthorized, likePost)
router.put('/posts/:id/unlike', isAuthorized, unlikePost)

export default router;