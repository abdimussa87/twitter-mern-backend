import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    content: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Post', PostSchema);