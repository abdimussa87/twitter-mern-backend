import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    profilePic: { type: String, default: 'public/profileImages/person_placeholder.jpeg' }
}, { timestamps: true })

export default mongoose.model('User', UserSchema);