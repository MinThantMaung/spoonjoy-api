const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        message: 'Too many requests from this IP. Please try again after a minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = rateLimiter;