import express from 'express'
import { createPost, getPosts, getPost,getUserPosts, deletePost, likePost, unlikePost, retweetPost, unretweetPost } from "../controller/postController.js";
import { isAuthorized } from "../middlewares/middleware.js";
const router = express.Router()

router.post('/posts', isAuthorized, createPost);
router.get('/posts', isAuthorized, getPosts);
router.get('/posts/:id', isAuthorized, getPost);
router.get('/posts/user/:username',isAuthorized,getUserPosts);
router.delete('/posts/:id', isAuthorized, deletePost);
router.put('/posts/:id/like', isAuthorized, likePost)
router.put('/posts/:id/unlike', isAuthorized, unlikePost)
router.post('/posts/:id/retweet', isAuthorized, retweetPost)
router.delete('/posts/:id/unretweet', isAuthorized, unretweetPost)


export default router;