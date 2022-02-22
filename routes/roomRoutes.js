const express = require('express');
const { RoomModel } = require('../models/Room');

const router = express.Router();

// roomList to get last chatted time and sort side pane
// {
//     roomName : 'To get the room name'
//     roomId : 'To get the room id'
//     lastChattedTime : 'To get the last chatted time'
// }

router.get('/room/:id', async (req, res) => {
    const roomId = req.params.id;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const room_data = await RoomModel.find({_id : roomId});
            console.log(room_data[0]);
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
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        new_room_data.messageList.push({
            from : 'none',
            body : 'Room creation time',
            time : dateTime
        });
        const new_room = await RoomModel.create(new_room_data);

        
        let write_room = {
                            roomName : new_room_data.roomName,
                            roomId : JSON.parse(JSON.stringify(new_room._id)),
                            lastChattedTime : dateTime
                        };
        global.roomList.push(write_room);
        console.log(new_room);
        console.log(global.roomList);
        res.send(new_room);
    }
    catch(err){
        console.log(err.code);
        res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.put('/room/messageList/:id', async (req, res) => {
    const roomId = req.params.id;
    const new_message = req.body;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const room_updation_status = await RoomModel.find({_id : roomId}).updateOne({$push : {messageList : new_message}});
            const updated_room_data = await RoomModel.find({ _id : roomId});

            const room_index = global.roomList.findIndex( data => data.roomId === roomId );
            global.roomList[room_index].lastChattedTime = new_message.time;
            console.log(updated_room_data);
            res.send({userList : updated_room_data[0].userList});
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
    const new_user = req.body;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const room_updation_status = await RoomModel.find({_id : roomId}).updateOne({$push : {userList : new_user}});
            const updated_room_data = await RoomModel.find({ _id : roomId});

            res.send({userList : updated_room_data[0].userList});
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
    const deleting_user = req.body;
    try{
        if(await RoomModel.exists({_id : roomId})){
            const room_updation_status = await RoomModel.find({_id : roomId}).updateOne({$pull : {userList : deleting_user}});
            const updated_room_data = await RoomModel.find({ _id : roomId});
            res.send({userList : updated_room_data[0].userList});
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