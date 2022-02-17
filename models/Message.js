const message = class {
    from = String;
    body = String;
    time = Date;

    constructor(from, body, time){
        this.from = from;
        this.body = body;
        this.time = time;
    }
};

module.exports = message;