const joinedRoom = class{
    roomName = String;
    roomId = Object;
    lastChattedTime = Object;
    constructor(roomName, roomId, lastChattedTime){
        this.roomId = roomId;
        this.roomName = roomName;
        this.lastChattedTime = lastChattedTime;
    }
};

module.exports = joinedRoom;