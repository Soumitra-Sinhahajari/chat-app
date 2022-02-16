const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName : {
        type : String,
        required
    },

    passWd : {
        type : String,
        required
    },

    isOnline : {
        type : Boolean,
        default : true
    }
});

const UserModel = mongoose.Model('user', userSchema);

module.exports = UserModel;