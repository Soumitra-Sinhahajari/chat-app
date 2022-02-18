const express = require('express');
const UserModel = require('../models/User');
const RoomModel = require('../models/Room');

const router = express.Router();

// Read user details at the time of login
router.get('/user/:name', async (req, res) => {
    const user_name = req.params.name;
    const user_passwd = req.body.passwd;
    try{
        if(await UserModel.exists({userName : user_name})){
            const user_data = await UserModel.find({userName : user_name});
            if(user_passwd === user_data[0].passWd)
            {
                res.send(user_data[0]);
            }
            else{
                res.status(400).send('Invalid user credentials');
            }
        }
        else{
            res.status(404).send('User data not found');
        }
    }
    catch(err){
            res.status(500).send(err);
    }
});

// Create new user at the time of registration
router.post('/user', async (req, res) => {
    const new_user_data = req.body;
    const last_message_time = null;
    if (commonRoomDetails.messageList.length > 0) {
        last_message_time = commonRoomDetails.messageList[messageList.length - 1];
    }
    new_user_data.joinedRoomList.push({
        roomName : commonRoomDetails.roomName,
        roomId : commonRoomDetails._id,
        lastChattedTime : last_message_time
    })
    try{
        if(!await UserModel.exists({userName : new_user_data.userName})){
            const new_user = await UserModel.create(new_user_data);
            res.send(new_user);
            // console.log(JSON.stringify(commonRoomDetails._id));
            
        }
        else{
            res.status(400).send('User already present');
        }
    }
    catch(err){
        console.log(err.code);
        res.status(500).send(err);
    }
});

// Update user deatils whenever needed
router.put('/user/:id', async (req, res) => {
    const user_id = req.params.id;
    const new_user_data = req.body;
    try{
        if(await UserModel.exists({_id : user_id})){
            const updated_user = await UserModel.findByIdAndUpdate(user_id, new_user_data);
            res.send("Updation successful");
        }
        else{
            res.status(404).send('User data not found');
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});

// Update 'joinedRoomList' property of user
router.put('/user/joinedRoom/:id' , async (req, res) => {
    const user_id = req.params.id;
    const new_room_details = req.body;
    try{
        if(await UserModel.exists({_id : user_id})){
            const updated_user = await UserModel.findByIdAndUpdate(user_id, {$push : {joinedRoomList : new_room_details}});
            res.send("Updation successful");
        }
        else{
            res.status(404).send('User data not found');
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;