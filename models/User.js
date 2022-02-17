const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },

    passWd : {
        type : String,
        required : true
    },

    // isOnline : {
    //     type : Boolean,
    //     default : false
    // },

    // socketId : {
    //     type : Object,
    //     default : null
    // },

    joinedRoomList : {
        type : Array,
        default : []
    }
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;