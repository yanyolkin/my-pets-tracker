const { badRequest } = require("../utils/appError");

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        if (err.name === "ZodError") {
            const issues = err.issues || err.errors || [];
            const formattedErrors = issues.map((e) => ({
                field: e.path.join(".").replace(/^(body|query|params)\./, ""),
                message: e.message,
            }));

            return next(badRequest("Ошибка валидации данных", formattedErrors));
        }
        next(err);
    }
};

module.exports = validate;
