// Error handling middleware
const CustomAPIError = require('../errors/CustomAPIError');

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({message: err.message || 'Oops something went wrong'});
    }
    // Handle other types of errors
    const error = new Error(err);
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'});
};

module.exports = errorHandlerMiddleware;