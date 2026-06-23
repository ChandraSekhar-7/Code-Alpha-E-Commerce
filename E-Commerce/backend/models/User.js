const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Note: In a production app, use bcrypt to hash this!
});

module.exports = mongoose.model('User', userSchema);