const mapPrismaError = (err) => {
    switch (err.code) {
        case "P2002": {
            const fields = err.meta?.target
                ? err.meta.target.join(", ")
                : "полей";
            return {
                statusCode: 409,
                message: `Конфликт дублирования данных. Значение для ${fields} уже используется.`,
            };
        }
        case "P2025":
            return {
                statusCode: 404,
                message: err.meta?.cause || "Запрашиваемая запись не найдена.",
            };
        case "P2003":
            return {
                statusCode: 400,
                message:
                    "Ошибка внешнего ключа. Связанная запись не существует.",
            };
        default:
            return {
                statusCode: 500,
                message: "Внутренняя ошибка базы данных.",
            };
    }
};

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Что-то пошло не так";
    let status = err.status || "error";
    let errors = err.errors || null;

    if (err.code && err.code.startsWith("P")) {
        const prismaTarget = mapPrismaError(err);
        statusCode = prismaTarget.statusCode;
        message = prismaTarget.message;
        status = "fail";
    }

    if (statusCode === 500) {
        console.error("💥 CRITICAL ERROR:", err);
    }

    res.status(statusCode).json({
        status,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;
