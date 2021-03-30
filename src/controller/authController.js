import UserCollection from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const signup = (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    UserCollection.findOne({
        $or: [
            { username }, { email }
        ]
    }, async (err, user) => {
        if (err) {
            res.status(500).send(err.message)
        } else if (user) {
            if (user.email === email) {
                res.status(401).json({ message: 'Email already in use' })
            } else {
                res.status(401).json({ message: 'Username already in use' })
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            UserCollection.create({ firstName, lastName, email, username, password: hashedPassword }, (err, data) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '10d' })
                    const { _id, firstName, lastName, email, username, profilePic } = data;
                    res.status(201).send({ token, user: { _id, firstName, lastName, email, username, profilePic } })
                }
            })
        }
    })

}

const signin = (req, res) => {
    UserCollection.findOne({
        $or: [
            { email: req.body.emailOrUsername }, { username: req.body.emailOrUsername }
        ]
    }, async (err, user) => {
        if (err) {
            res.status(500).json({ message: err })
        } else if (user) {
            const validCredential = await bcrypt.compare(req.body.password, user.password)
            if (validCredential) {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
                const { _id, firstName, lastName, email, username, profilePic } = user;
                res.status(200).send({ token, user: { _id, firstName, lastName, email, username, profilePic } })

            }
            else {
                res.status(404).json({ message: 'Invalid credentials' })
            }
        } else {
            res.status(404).json({ message: 'Invalid credentials' })
        }
    })

}

export { signup, signin }