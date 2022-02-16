const userPane = class{
    userList = Array;
    roomId = Object;
    lastChatTime = Date;
    constructor(userList, roomId, lastChatTime){
        this.userList = userList;
        this.roomId = roomId;
        this.lastChatTime = lastChatTime;
    }
};

module.exports = userPane;