const jwt = require('jsonwebtoken');
const env = require('../../config/env');

function issueToken({ userId, role }) {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.jwtSecret,
    { expiresIn: '12h' }
  );
}

module.exports = {
  issueToken,
};
