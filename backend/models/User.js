const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    confirmpassword: String
})

module.exports = mongoose.model('User', UserSchema);