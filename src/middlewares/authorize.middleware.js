const AppError = require('../errors/AppError');

function authorizeProfiles(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError({
          code: 'notAuthenticated',
          message: 'User is not authenticated.',
          status: 401,
        })
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError({
          code: 'unauthorized',
          message: 'User role is not allowed to execute this uuCmd.',
          status: 403,
        })
      );
    }

    return next();
  };
}

function enforceOwnership(user, ownerId) {
  if (!user) {
    throw new AppError({
      code: 'notAuthenticated',
      message: 'User is not authenticated.',
      status: 401,
    });
  }

  if (user.role === 'Authorities') {
    return;
  }

  if (!ownerId || ownerId !== user.userId) {
    throw new AppError({
      code: 'forbiddenNotOwner',
      message: 'User is not the owner of the resource.',
      status: 403,
    });
  }
}

module.exports = {
  authorizeProfiles,
  enforceOwnership,
};
