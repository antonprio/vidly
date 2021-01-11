const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    /* If no token send to the server, give 401 unauthorized response */
    if(!token) return res.status(401).send('Access denied. No token provided');

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
}