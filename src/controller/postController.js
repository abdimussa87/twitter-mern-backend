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
                    res.status(201).json({ createdPost })
                } catch (err) {
                    return res.status(500).json({ message: err })
                }

            }
        })
    } else {
        res.status(400).send()
    }
}

export const getPosts = async (req, res) => {
    try {

        const posts = await PostCollection.find({})
            .populate({ path: 'postedBy', select: 'profilePic firstName lastName username _id' })
        res.status(200).json({ posts: posts })
    } catch (err) {
        res.status(500).json({ message: err })
    }

}