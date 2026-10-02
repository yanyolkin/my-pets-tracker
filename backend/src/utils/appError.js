const createAppError = (message, statusCode, errors = null) => {
    const status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    return {
        message,
        statusCode,
        status,
        errors,
        isOperational: true,
        stack: new Error().stack,
    };
};

const badRequest = (message = "Bad request", errors=null) =>
    createAppError(message, 400, errors);
const unauthorized = (message = "Unauthorized") =>
    createAppError(message, 401);
const forbidden = (message = "Forbidden") =>
    createAppError(message, 403);
const notFound = (message = "Not found") => createAppError(message, 404);
const conflict = (message = "Resource already exists") =>
    createAppError(message, 409);

module.exports = {
    createAppError,
    badRequest,
    unauthorized,
    notFound,
    conflict,
    forbidden,
};
