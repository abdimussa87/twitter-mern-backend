import PostCollection from '../models/postModel.js'
import UserCollection from '../models/userModel.js'
export const createPost = (req, res) => {
    const { content, replyTo } = req.body
    if (!content) {
        return res.sendStatus(400)
    }
    const newPost = {}
    newPost.content = content;
    newPost.postedBy = req.userId;
    if (replyTo) {
        newPost.replyTo = replyTo;
    }
    PostCollection.create(newPost, async (err, createdPost) => {
        if (err) {
            res.status(500).json({ message: err })
        } else {
            try {
                if (replyTo) {
                    await PostCollection.findByIdAndUpdate(replyTo, {
                        '$addToSet': {
                            replyUsers: req.userId
                        }
                    })
                }
                createdPost = await UserCollection.populate(createdPost, { path: 'postedBy', select: 'profilePic firstName lastName username _id' })
                createdPost = await PostCollection.populate(createdPost, { path: 'replyTo' })
                createdPost = await UserCollection.populate(createdPost, { path: 'replyTo.postedBy', select: 'profilePic firstName lastName username _id' })
                res.status(201).json({ createdPost })
            } catch (err) {
                return res.status(500).json({ message: err })
            }

        }
    })

}

export const getPosts = async (req, res) => {
    let filter = {}

    if (req.query.replies) {
        filter.replyTo = req.query.replies
    }
    try {
        let postsFromDb = await PostCollection.find(filter)
            .populate({ path: 'postedBy', select: 'profilePic firstName lastName username _id' })
            .populate('retweetData')
            .populate('replyTo')
            .sort({ createdAt: -1 })
        postsFromDb = await UserCollection.populate(postsFromDb, { path: 'retweetData.postedBy', select: 'profilePic firstName lastName username _id' })
        postsFromDb = await UserCollection.populate(postsFromDb, { path: 'replyTo.postedBy', select: 'profilePic firstName lastName username _id' })
        res.status(200).json({ posts: postsFromDb })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}
export const getPost = async (req, res) => {
    const postId = req.params.id
    try {
        let postFromDb = await PostCollection.findById(postId)
            .populate({ path: 'postedBy', select: 'profilePic firstName lastName username _id' })
            .populate('retweetData')
            .populate('replyTo')
            .sort({ createdAt: -1 })

        postFromDb = await UserCollection.populate(postFromDb, { path: 'retweetData.postedBy', select: 'profilePic firstName lastName username _id' })
        postFromDb = await UserCollection.populate(postFromDb, { path: 'replyTo.postedBy', select: 'profilePic firstName lastName username _id' })
        res.status(200).json({ post: postFromDb })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}

export const deletePost = async (req, res) => {
    const postId = req.params.id
    if (!postId) {
        return res.sendStatus(400)
    }
    try {
        const doc = await PostCollection.findOne({ _id: postId })
        await doc.deleteOne()
        res.sendStatus(204)
    } catch (err) {
        console.log(err);
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
        res.status(201).json({ retweetPost })
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