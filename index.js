const express = require('express');
const app = express();
const user_routes = require('./routes/userRoutes');
const room_routes = require('./routes/roomRoutes');
const mongoose = require('mongoose');
const {RoomModel, create_and_get_common_room_details} = require('./models/Room');

mongoose.connect('mongodb+srv://soumitra:1234@primarycluster.yssrr.mongodb.net/TrialDB');

app.use(express.json());

app.use('/api', user_routes);

app.use('/api', room_routes);


create_and_get_common_room_details("Common chat room")
.then((res) => {
    global.commonRoomDetails = res[0];
    app.listen(8000, ()=>{
        console.log('Server started successfully');
    });
}).catch((err)=>{
    console.log("Error is : ",err.message);
});
