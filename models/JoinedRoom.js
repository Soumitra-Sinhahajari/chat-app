const joinedRoom = class{
    roomName = String;
    roomId = Object;
    // lastChattedTime = Date;
    constructor(roomId, roomName){
        this.roomId = roomId;
        this.roomName = roomName;
        // this.lastChattedTime = lastChattedTime;
    }
};

module.exports = joinedRoom;