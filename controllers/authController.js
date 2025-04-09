const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { userId: user._id, email: user.email };
        const accessToken = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: 'No refresh token provided' });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateToken({ userId: payload.userId, email: payload.email });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
