const AppError = require('../../errors/AppError');

const ShoppingListErrors = {
  notFound: () =>
    new AppError({
      code: 'shoppingListNotFound',
      message: 'Shopping list not found.',
      status: 404,
    }),
};

module.exports = ShoppingListErrors;
