const express = require('express');
const app = express();
const routes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const {create_and_get_common_room_details} = require('./models/Room');

mongoose.connect('mongodb+srv://soumitra:1234@primarycluster.yssrr.mongodb.net/TrialDB');

const commonRoomDetails = create_and_get_common_room_details("Common chat room");

app.use(express.json());

app.use('/api', routes);

// app.use('/api/register');

app.listen(8000, ()=>{
    console.log('Server started successfully');
});