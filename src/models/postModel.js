import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    content: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true })

export default mongoose.model('Post', PostSchema);