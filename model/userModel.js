const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    isActive:Boolean
});

mongoose.model('users', userSchema);

module.exports = mongoose.model('users');