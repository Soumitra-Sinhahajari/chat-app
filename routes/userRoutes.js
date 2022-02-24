const express = require('express');
const UserModel = require('../models/User');
const RoomModel = require('../models/Room');

const router = express.Router();

// Get all user list from server
router.get('/user/all', async (req,res) => {
    try{
        const all_user_list = await UserModel.find({});
        const send_user_list = [];
        all_user_list.forEach(user => {
            const user_details = { userName : user.userName};
            send_user_list.push(user_details);
        });
        res.send(send_user_list);
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

// Get room list with last chatted time
router.get('/user/roomList/:id', async (req, res) => {
    const user_id = req.params.id;
    try{
        if(await UserModel.exists({_id : user_id})){
            const user = await UserModel.find({ _id : user_id });
            const user_room_list = user[0].joinedRoomList;
            console.log(user_room_list);
            let new_room_list = [];
            user_room_list.forEach(element => {
                const room_index = global.roomList.findIndex( room => room.roomId === element.roomId );
                console.log(room_index);
                new_room_list.push(global.roomList[room_index]);
            });
            res.send(new_room_list);
        }
        else{
            res.status(404).send({errorMessage : 'User data not found'});
        }
    }
    catch(err){
        res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

// Check if username exists or not
router.get('/user/check/:name', async (req, res) => {
    const user_name = req.params.name;
    try{
        if(await UserModel.exists({userName : user_name})){
            const user_data = await UserModel.find({userName : user_name});
            console.log(user_data[0].userName);
            res.send(user_data[0].userName);
        }
        else{
            res.status(404).send({errorMessage : 'User not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});


// Read user details at the time of login
router.get('/user/:name/:passWd', async (req, res) => {
    const user_name = req.params.name;
    const user_passwd = req.params.passWd;
    try{
        if(await UserModel.exists({userName : user_name})){
            const user_data = await UserModel.find({userName : user_name});
            if(user_passwd === user_data[0].passWd)
            {
                res.send(user_data[0]);
            }
            else{
                res.status(400).send({errorMessage : 'Invalid user credentials'});
            }
        }
        else{
            res.status(404).send({errorMessage : 'User data not found'});
        }
    }
    catch(err){
            res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

// Create new user at the time of registration
router.post('/user', async (req, res) => {
    const new_user_data = req.body;
    console.log('request received');
    console.log(commonRoomDetails);
    new_user_data.joinedRoomList.push({
        roomName : commonRoomDetails.roomName,
        roomId : JSON.parse(JSON.stringify(commonRoomDetails._id)),
    })
    try{
        if(!await UserModel.exists({userName : new_user_data.userName})){
            const new_user = await UserModel.create(new_user_data);
            res.send(new_user);
            // console.log(JSON.stringify(commonRoomDetails._id));
            
        }
        else{
            res.status(400).send({errorMessage : 'User already present'});
        }
    }
    catch(err){
        console.log(err.code);
        res.status(500).send({errorMessage : 'Internal Server Error'});
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
            res.status(404).send({errorMessage : 'User data not found'});
        }
    }
    catch(err){
        res.status(500).send({errorMessage : 'Internal Server Error'});
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
            res.status(404).send({errorMessage : 'User data not found'});
        }
    }
    catch(err){
        res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

router.delete('/user/joinedRoom/:id', async (req, res) => {
    const user_id = req.params.id;
    const deleting_room = req.body;
    try{
        if(await UserModel.exists({_id : user_id})){
            const updated_user = await UserModel.findByIdAndUpdate(user_id, {$pull : {joinedRoomList : deleting_room}});
            res.send("Deletion successful");
        }
        else{
            res.status(404).send({errorMessage : 'User data not found'});
        }
    }
    catch(err){
        res.status(500).send({errorMessage : 'Internal Server Error'});
    }
});

module.exports = router;