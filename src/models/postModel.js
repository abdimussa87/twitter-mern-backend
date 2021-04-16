import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    content: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    replyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true })


PostSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    const postId = this._id;
    mongoose.model("Post").deleteMany({ replyTo: postId }, function (err, result) {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
})
export default mongoose.model('Post', PostSchema);