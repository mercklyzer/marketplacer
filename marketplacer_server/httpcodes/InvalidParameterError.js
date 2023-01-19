const errorCodes = require('./codes');

class InvalidParameterError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'InvalidParameterError';
        this.statusCode = 422;
        this.code = code;
        this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidParameterError;