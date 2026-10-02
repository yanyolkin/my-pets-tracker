const jwt = require("jsonwebtoken");
const { unauthorized, forbidden } = require("../utils/appError");

const protect = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return next(unauthorized("Вы не авторизованы (отсутствует токен)"));
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(unauthorized("Невалидный или истекший токен доступа"));
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                forbidden("У вас нет прав для выполнения этого действия"),
            );
        }
        next();
    };
};

module.exports = { protect, restrictTo };
