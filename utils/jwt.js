const jwt = require('jsonwebtoken');

function generateToken(payload, expiresIn = '15m') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function generateRefreshToken(payload,expiresIn = '7d') {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
}

module.exports = { generateToken,generateRefreshToken };