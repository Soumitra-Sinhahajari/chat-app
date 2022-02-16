const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    // roomName : {
    //     type : String
    // },

    userList : {
        type : Array
    },

    isBroadcast : {
        type : Boolean,
        default : true
    },

    // isMulticast : {
    //     type : Boolean,
    //     default : false
    // },

    messageList : {
        type : Array
    }
});

const RoomModel = mongoose.model('room',roomSchema);

module.exports = RoomModel;