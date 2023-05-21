const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    domain: String,
    mentor: String,
    role: String,
});

module.exports = mongoose.model('User', userSchema);
