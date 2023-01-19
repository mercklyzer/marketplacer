const errorCodes = require('./codes');

class InvalidPayloadError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'InvalidPayloadError';
        this.statusCode = 422;
        this.code = code;
        this.message = this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidPayloadError;