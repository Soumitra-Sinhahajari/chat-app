const express = require('express');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/userRoutes');
const room_routes = require('./routes/roomRoutes');
const socket = require('socket.io');
const mongoose = require('mongoose');
const {RoomModel, create_and_get_common_room_details} = require('./models/Room');
const UserModel = require('./models/User');

//  user-socket list structure here
// {
//     userName : 'Will store the unique user name', 
//     socket   : 'Will store the socket (if online)',
//     isOnline : 'Boolean value to check if user is online',
// }
const userList = [];

// mongoose.connect('mongodb+srv://soumitra:1234@primarycluster.yssrr.mongodb.net/TrialDB');
mongoose.connect('mongodb://localhost:27017/chatapptrialdb', 
    {
        authSource: "admin",
        "user": "kdjonty",
        "pass": "jakeperalta99"
    }
);
mongoose.Promise = global.Promise;

app.use(cors({ credetials : true}));

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
.then(async (res) => {
    global.commonRoomDetails = res;
    console.log(commonRoomDetails);
    global.roomList = [];
    const all_room = await RoomModel.find({});
    all_room.forEach((data) => {
        global.roomList.push({
            roomName : data.roomName,
            roomId : JSON.parse(JSON.stringify(data._id)),
            lastChattedTime : data.messageList[data.messageList.length - 1].time
        });
    });

    console.log(roomList);
    const server = app.listen(8000, ()=>{
        console.log('Server started successfully');
    });

    const io = socket(server, {
        cors : {
            origins : ["*"],
            handlePreflightRequest : (req, res) => {
                res.writeHead(200, {
                    "Access-Control-Allow-Origin" : "*",
                    // "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Credentials" : true
                });
                res.end();
            }
        }
    });

    // io.use(cors());

    io.on('connection', (socket) => {

        socket.on('trying-to-connect', (info) => {
            const isPresent = userList.some(data => data.userName === info.userName);
            console.log(isPresent);
            if(isPresent){
                const user_index = userList.findIndex(data => data.userName === info.userName);
                if(userList[user_index].isOnline === true){
                    socket.emit('error',{message : 'Already connected'});
                }
                else{
                    userList[user_index].isOnline = true;
                    userList[user_index].socket = socket;
                    socket.emit('success',{message : 'User connected successfully'});
                    console.log('Connected Successfully\n' + userList);
                }
            }
            else{
                const user_info = {
                                    userName : info.userName,
                                    isOnline : true,
                                    socket : socket
                                };
                userList.push(user_info);
                console.log(userList);
                socket.emit('success',{message : 'User connected successfully'});
                console.log('Connected Successfully' + socket.id);
            }
        }); 

        socket.on('leaving', (info) => {
            const user_index = userList.findIndex(data => data.userName === info.userName);
            userList[user_index].isOnline = false;
            userList[user_index].socket = null;
            socket.disconnect();
            console.log('Disconnected Successfully' + socket.id);
        });

        socket.on('message', (info) => {
            const send_data = {
                roomId : info.roomId,
                message : info.message
            };
            console.log(info);

            info.userList.forEach((user) => {
                const user_index = userList.findIndex(data => data.userName === user.userName);
                if (userList[user_index] != undefined){
                    if(userList[user_index].isOnline === true){
                        console.log('message sent to ' + user.userName);
                        console.log(send_data);
                        userList[user_index].socket.emit('message', send_data);
                    }
                }
            });
        });

        socket.on('room created', (info) => {
            const new_room_index = global.roomList.findIndex(data => data.roomId === info.roomId);
            const new_room_details = global.roomList[new_room_index];

            info.userList.forEach((user) => {
                UserModel.findOneAndUpdate({userName : user.userName}, {$push : {joinedRoomList : {roomId : info.roomId, roomName : info.roomName}}});
            });

            info.userList.forEach((user) => {
                const user_index = userList.findIndex(data => data.userName === user.userName);
                if (userList[user_index] != undefined){
                    if(userList[user_index].isOnline === true){
                        userList[user_index].socket.emit('room created', new_room_details);
                    }
                }
            });
        });

        socket.on('user joined room', (info) => {
            const send_data = {
                roomId : info.roomId,
                userName : info.userName
            };

            info.userList.forEach((user) => {
                const user_index = userList.findIndex(data => data.userName === user.userName);
                if(userList[user_index].isOnline === true){
                    userList[user_index].socket.emit('user joined room',send_data);
                }
            });
        });

        socket.on('user left room', (info) => {
            const send_data = {
                roomId : info.roomId,
                userName : info.userName
            };

            info.userList.forEach((user) => {
                const user_index = userList.findIndex(data => data.userName === user.userName);
                if(userList[user_index].isOnline === true){
                    userList[user_index].socket.emit('user left room',send_data);
                }
            });
        });
    });
}).catch((err)=>{
    console.log("Error is : ",err.message);
});
