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
                    let sendablePost = { ...createdPost.toObject(), likes: [], isLiked: false, isRetweeted: false }
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
        let postsFromDb = await PostCollection.find({})
            .populate({ path: 'postedBy', select: 'profilePic firstName lastName username _id' })
            .populate('retweetData')
            .sort({ createdAt: -1 })
        const posts = []
        postsFromDb = await UserCollection.populate(postsFromDb, { path: 'retweetData.postedBy', select: 'profilePic firstName lastName username _id' })
        postsFromDb.forEach((post) => {
            let isLiked = false;
            let isRetweeted = false;
            if (post.likes.includes(req.userId)) {
                isLiked = true;
            }
            if (post.retweetUsers.includes(req.userId)) {
                isRetweeted = true;
            }
            posts.push({ ...post.toObject(), isLiked, isRetweeted })
        })
        res.status(200).json({ posts: posts })
    } catch (err) {
        console.log(err)
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

export const retweetPost = async (req, res) => {
    const postId = req.params.id
    try {

        let retweetPost = await PostCollection.create({ retweetData: postId, postedBy: req.userId, retweetUsers: [req.userId] })

        await UserCollection.findByIdAndUpdate(req.userId, {
            '$addToSet': {
                retweets: retweetPost._id
            }
        })
        await PostCollection.findByIdAndUpdate(postId, {
            '$addToSet': {
                retweetUsers: req.userId
            }
        })

        retweetPost = await UserCollection.populate(retweetPost, { path: 'postedBy', select: 'profilePic firstName lastName username _id' })
        retweetPost = await PostCollection.populate(retweetPost, { path: 'retweetData' })
        retweetPost = await UserCollection.populate(retweetPost, { path: 'retweetData.postedBy', select: 'profilePic firstName lastName username _id' })

        const sendableRetweetPost = { ...retweetPost.toObject(), likes: [], isLiked: false, isRetweeted: true }
        res.status(201).json({ retweetPost: sendableRetweetPost })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}
export const unretweetPost = async (req, res) => {
    const postId = req.params.id
    try {

        await UserCollection.findByIdAndUpdate(req.userId, {
            '$pull': {
                retweets: postId
            }
        })
        await PostCollection.findByIdAndUpdate(postId, { '$pull': { retweetUsers: req.userId } })
        const deletedRetweet = await PostCollection.findOneAndDelete({ postedBy: req.userId, retweetData: postId })
        res.status(200).json({ deletedRetweet })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}