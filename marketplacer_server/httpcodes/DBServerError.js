const errorCodes = require('./codes');

class DBServerError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'DBServerError';
        this.statusCode = 516;
        this.code = code;
        this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DBServerError;