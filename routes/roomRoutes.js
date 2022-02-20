const express = require('express');
const { RoomModel } = require('../models/Room');

const router = express.Router();

// roomList to get last chatted time and sort side pane
// {
//     roomName : 'To get the room name'
//     roomId : 'To get the room id'
//     lastChattedTime : 'To get the last chatted time'
// }

global.roomList = [];

router.get('/room/:id', async (req, res) => {
    const roomId = req.params.id;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const room_data = await RoomModel.find({_id : roomId});
            res.send(room_data[0]);
        }
        else{
            res.status(404).send({errorMessage : 'Room data not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.post('/room', async (req, res) => {
    const new_room_data = req.body;

    

    try{
        const new_room = await RoomModel.create(new_room_data);

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        let write_room;
        write_room.roomName = new_room_data.roomName;
        write_room.roomId = new_room._id;
        // have to see this...sort e lagbe
        write_room.lastChattedTime = dateTime;
        global.roomList.push(write_room);

        res.send(new_room);
    }
    catch(err){
        console.log(err.code);
        res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.put('/room/messageList/:id', async (req, res) => {
    const roomId = req.params.id;
    const new_message = req.body.newMessage;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const updated_room_data = await RoomModel.find({_id : roomId}).updateOne({$push : {messageList : new_message}});
            
            const room_index = global.roomList.findIndex( data => data.roomId === roomId );
            global.roomList[room_index].lastChattedTime = new_message.time;
            
            res.send({userList : updated_room_data.userList});
        }
        else{
            res.status(404).send({errorMessage : 'Room data not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.put('/room/userList/:id', async (req, res) => {
    const roomId = req.params.id;
    const new_user = req.body.newUser;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const updated_room_data = await RoomModel.find({_id : roomId}).updateOne({$push : {userList : new_user}});
            res.send("Updation successful");
        }
        else{
            res.status(404).send({errorMessage : 'Room data not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.delete('/room/userList/:id', async (req, res) => {
    const roomId = req.params.id;
    const user_name = req.body.userName;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const updated_room_data = await RoomModel.find({_id : roomId}).updateOne({$pull : {userList : user_name}});
            res.send("Deletion successful");
        }
        else{
            res.status(404).send({errorMessage : 'Room data not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

module.exports = router;