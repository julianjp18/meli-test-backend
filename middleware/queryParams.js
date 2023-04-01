const boom = require('@hapi/boom');

const validateParams = (req, res, next) => {
    const { q } = req.query;
    if (q) next();
    else throw boom.notFound('Query params not found');
};

module.exports = validateParams;