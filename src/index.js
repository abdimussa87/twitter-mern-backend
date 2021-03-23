import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import dotenv from 'dotenv'

// *Useful for getting environment vairables
dotenv.config();

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hi there')
})

app.use(cors());
app.use(express.json())
app.use('/api', authRoutes);

// *Database connection
mongoose.connect("mongodb://localhost/twitter-clone", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(value => console.log('Connected to db'));


app.listen('8080', () => {
    console.log('Listening on port 8080')
})