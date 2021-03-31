import PostCollection from '../models/postModel.js'
import UserCollection from '../models/userModel.js'
export const createPost = (req, res) => {
    const { content } = req.body
    if (content) {
        PostCollection.create({ content, postedBy: req.userId }, async (err, createdPost) => {
            if (err) {
                res.status(500).json({ message: err })
            } else {
                try {
                    createdPost = await UserCollection.populate(createdPost, { path: 'postedBy', select: 'profilePic firstName lastName username _id' })
                    let sendablePost = { ...createdPost.toObject(), likes: [], isLiked: false }
                    res.status(201).json({ createdPost: sendablePost })
                } catch (err) {
                    return res.status(500).json({ message: err })
                }

            }
        })
    } else {
        res.sendStatus(400)
    }
}

export const getPosts = async (req, res) => {
    try {
        const postsFromDb = await PostCollection.find({})
            .populate({ path: 'postedBy', select: 'profilePic firstName lastName username _id' })
            .sort({ createdAt: -1 })
        const posts = []
        postsFromDb.forEach((post) => {
            post.likes.includes(req.userId) ? posts.push({ ...post.toObject(), isLiked: true }) : posts.push({ ...post.toObject(), isLiked: false })
        })
        res.status(200).json({ posts: posts })
    } catch (err) {
        res.status(500).json({ message: err })
    }

}

export const likePost = async (req, res) => {
    const postId = req.params.id
    try {

        await UserCollection.findByIdAndUpdate(req.userId, {
            '$addToSet': {
                likes: postId
            }
        })
        await PostCollection.findByIdAndUpdate(postId, { '$addToSet': { likes: req.userId } })
        res.sendStatus(204)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }

}
export const unlikePost = async (req, res) => {
    const postId = req.params.id
    try {

        await UserCollection.findByIdAndUpdate(req.userId, {
            '$pull': {
                likes: postId
            }
        })
        await PostCollection.findByIdAndUpdate(postId, { '$pull': { likes: req.userId } })
        res.sendStatus(204)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }

}