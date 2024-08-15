const BadRequestError = require('./BadRequestError');
const UnauthenticatedError = require('./UnauthenticatedError');
const NotFoundError = require('./NotFoundError');
const CustomAPIError = require('./CustomAPIError');
const ConflictError = require('./ConflictError');
const InternalServerError = require('./InternalServerError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
    CustomAPIError,
    ConflictError,
    InternalServerError,
    ForbiddenError
}