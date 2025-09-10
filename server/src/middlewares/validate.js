const createError = require('http-errors');

const joiOptions = { abortEarly: false, stripUnknown: true, convert: true };

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, joiOptions);
    if (error) return next(createError(400, { message: 'Validation error', details: error.details }));
    req.body = value;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, joiOptions);
    if (error) return next(createError(400, { message: 'Validation error', details: error.details }));
    req.query = value;
    next();
  };
}

function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, joiOptions);
    if (error) return next(createError(400, { message: 'Validation error', details: error.details }));
    req.params = value;
    next();
  };
}

// Backward compatible default export (validates body)
function defaultExport(schema) { return validateBody(schema); }

module.exports = defaultExport;
module.exports.validateBody = validateBody;
module.exports.validateQuery = validateQuery;
module.exports.validateParams = validateParams;
