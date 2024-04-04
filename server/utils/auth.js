const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const expiration = '12h';

function generateToken({ firstName, email, _id }) {
    // Create and return a JWT
    const payload = { firstName, email, _id }
    return jwt.sign({ data: payload }, secretKey, { expiresIn: expiration });
}

function verifyToken(token) {
    // Verify and decode the token
    return jwt.verify(token, secretKey);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        req.user = user; // Set the user object in the request
        next();
    });
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
};