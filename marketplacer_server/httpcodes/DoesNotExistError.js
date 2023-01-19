const errorCodes = require('./codes');

class DoesNotExistError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'DoesNotExistError';
        this.statusCode = 404;
        this.code = code;
        this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DoesNotExistError;