// Validation middleware
const {BadRequestError} = require('../errors/index');
const {validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");


exports.handleValidationErrors = asyncHandler((req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const {errors} = result;
        throw new BadRequestError(errors[0].msg)
    }

    next();
});