import jwt from 'jsonwebtoken'
export const isAuthorized = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).send("Authorization required");
    }

    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({ message: err })
        } else {
            req.userId = user._id;
            next();
        }
    });
}
