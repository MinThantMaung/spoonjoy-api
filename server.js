require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/v1/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Welcome');
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));