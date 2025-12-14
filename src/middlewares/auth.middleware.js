const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../errors/AppError');

function parseToken(headerValue) {
  if (!headerValue) return null;
  const [type, token] = headerValue.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

function requireAuth(req, res, next) {
  try {
    const token = parseToken(req.headers.authorization);
    if (!token) {
      throw new AppError({
        code: 'notAuthenticated',
        message: 'Authorization token is missing.',
        status: 401,
      });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      userId: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError({
        code: 'notAuthenticated',
        message: 'Invalid or expired token.',
        status: 401,
      })
    );
  }
}

module.exports = requireAuth;
