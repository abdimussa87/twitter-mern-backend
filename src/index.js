import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'




import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

// *Useful for getting environment vairables
dotenv.config();

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hi there')
})

app.use(cors());
app.use(express.json())
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', messageRoutes);





app.use('/public/profileImages', express.static(path.join('./src', 'uploads/profilePictures')))

// *Database connection
mongoose.connect("mongodb://localhost/twitter-clone", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(value => console.log('Connected to db'));


app.listen('8080', () => {
    console.log('Listening on port 8080')
})