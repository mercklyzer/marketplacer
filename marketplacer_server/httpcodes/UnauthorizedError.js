const errorCodes = require('./codes');

class UnauthorizedError extends Error {
    constructor(code, message){
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
        this.code = code;
        this.message = this.message = message || errorCodes[code].message;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnauthorizedError;