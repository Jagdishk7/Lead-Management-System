const createError = require('http-errors');

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(createError(400, { message: 'Validation error', details: error.details }));
    }
    req.body = value;
    next();
};

module.exports = validate;
