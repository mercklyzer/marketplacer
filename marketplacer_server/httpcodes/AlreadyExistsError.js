const errorCodes = require('./codes');

class AlreadyExistsError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'AlreadyExistsError';
        this.statusCode = 409;
        this.code = code;
        this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AlreadyExistsError;