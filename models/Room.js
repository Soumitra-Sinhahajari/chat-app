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

    isMulticast : {   
        type : Boolean,
        default : false
    },

    messageList : {
        type : Array
    }
});

const RoomModel = mongoose.model('room',roomSchema);

const create_and_get_common_room_details = async (room_name) => {
    try{
        if(!await RoomModel.exists({roomName : room_name})){
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
            var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
            var dateTime = date+' '+time;
            const commonRoomDetails = await RoomModel.create({
                roomName : room_name,
                userList : [],
                isBroadcast : true,
                messageList : [{
                    from : 'none',
                    body : 'Room creation time',
                    time : dateTime
                }]
            });
            return commonRoomDetails;
        }
        else{
            const commonRoomDetails = await RoomModel.find({roomName : room_name});
            return commonRoomDetails[0];
        }
    }
    catch(err){
        console.log(err);
    }
};

module.exports = {RoomModel, create_and_get_common_room_details};