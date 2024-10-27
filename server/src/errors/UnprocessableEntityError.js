const CustomAPIError = require("./CustomAPIError");
const {StatusCodes} = require("http-status-codes");

class UnprocessableEntityError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    }
}

module.exports = UnprocessableEntityError;