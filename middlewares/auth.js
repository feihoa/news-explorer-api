const jwt = require('jsonwebtoken');
const JWT_SECRET_DEV = require('../JWT_SECRET_DEV.js');
const AuthorizationError = require('../errors/authorization-err');
const { authErr } = require('../constants/constants.js');

const handleAuthError = () => {
  throw new AuthorizationError(authErr);
};

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!req.cookies.jwt) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
  return true;
};
