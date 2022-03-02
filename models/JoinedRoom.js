const joinedRoom = class{
    roomName = String;
    roomId = Object;
    constructor(roomId, roomName){
        this.roomId = roomId;
        this.roomName = roomName;
    }
};

module.exports = joinedRoom;