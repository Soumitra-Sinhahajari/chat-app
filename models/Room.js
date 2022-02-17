const mongoose = require('mongoose');

// to edit: room id diye replace as key
const roomSchema = mongoose.Schema({
    roomName : {
        type : String
    },

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

const create_and_get_common_room_details = async (room_name) => {
    try{
        if(!await RoomModel.exists({roomName : room_name})){
            const commonRoomDetails = await RoomModel.create({
                roomName : room_name,
                userList : [],
                isBroadcast : true,
                messageList : []
            });
            return commonRoomDetails;
        }
        else{
            commonRoomDetails = await RoomModel.find({roomName : room_name});
            return commonRoomDetails;
        }
    }
    catch(err){
        console.log(err);
    }
};

module.exports = {RoomModel, create_and_get_common_room_details};