const express = require('express');
const UserModel = require('../models/User');

const {create_and_get_common_room_details} = require('./models/Room');
// const commonRoomDetails = create_and_get_common_room_details("Common chat room");

const router = express.Router();

// Read user details at the time of login
router.get('/user/:name', async (req, res) => {
    const user_name = req.params.name;
    try{
        if(await UserModel.exists({userName : user_name})){
            const user_data = await UserModel.find({userName : user_name});
            res.send(user_data);
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
    const commonRoomDetails = create_and_get_common_room_details("Common chat room");
    const last_message_time = Date;
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
router.put('/user/:name', async (req, res) => {
    const user_name = req.params.name;
    const new_user_data = req.body;
    try{
        const updated_user = await UserModel.find({userName : user_name}).update(new_user_data);
        res.send(updated_user);
    }
    catch(err){
        res.status(500).send(err);
    }
});

// Update 'joinedRoomList' property of user
router.put('/user/joinedRoom/:name' , async (req, res) => {
    const user_name = req.params.name;
    const new_room_details = req.body;
    try{
        const updated_user = await UserModel.find({userName : user_name}).update({$push : {joinedRoomList : new_room_details}});
        res.send(updated_user);
    }
    catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;