const express = require('express');
const app = express();
const user_routes = require('./routes/userRoutes');
const room_routes = require('./routes/roomRoutes');
const socket = require('socket.io');
const mongoose = require('mongoose');
const {RoomModel, create_and_get_common_room_details} = require('./models/Room');

//  user-socket list structure here
// {
//     userID   : 'Will store the unique user name', 
//     socketID : 'Will store the socket id (if online)',
//     isOnline : 'Boolean value to check if user is online',
// }
const userList = Array;

mongoose.connect('mongodb+srv://soumitra:1234@primarycluster.yssrr.mongodb.net/TrialDB');

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api', user_routes);

app.use('/api', room_routes);


create_and_get_common_room_details("Common chat room")
.then((res) => {
    global.commonRoomDetails = res[0];
    const server = app.listen(8000, ()=>{
        console.log('Server started successfully');
    });

    const io = socket(server);

    io.on('connection', (socket) => {

        socket.on('trying-to-connect', (info) => {
            const isPresent = userList.some((data) => {data.userID === info.userID;});
            if(isPresent){
                const user_index = userList.findIndex((data) => {data.userID === info.userID;});
                if(userList[user_index].isOnline === true){
                    socket.emit('error',{message : 'Already connected'});
                }
                else{
                    userList[user_index].isOnline = true;
                    userList[user_index].socketID = socket.id;
                    socket.emit('success',{message : 'User connected successfully'});
                }
            }
            else{
                const user_info = {
                                    userID : info.userID,
                                    isOnline : true,
                                    socketID : socket.id
                                };
                userList.push(user_info);
                socket.emit('success',{message : 'User connected successfully'});
            }
        }); 

        socket.on('leaving', (info) => {
            const user_index = userList.findIndex((data) => {data.userID === info.userID;});
            userList[user_index].isOnline = false;
            userList[user_index].socketID = null;
            socket.disconnect();
        });

        
    });
}).catch((err)=>{
    console.log("Error is : ",err.message);
});
