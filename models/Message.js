const message = class {
    from = String;
    to = String;
    body = String;
    isBroadcast = Boolean;

    constructor(from, to, body, isBroadcast){
        this.from = from;
        this.to = to;
        this.body = body;
        this.isBroadcast = isBroadcast;
    }
};

module.exports = message;