const shoppingListDao = require('./shoppingList.dao');
const ShoppingListErrors = require('./shoppingList.errors');
const { enforceOwnership } = require('../../middlewares/authorize.middleware');
const { omitUndefined } = require('../../utils/object');

async function createShoppingList({ name, items }, session) {
  return shoppingListDao.create({
    name,
    items,
    owner: session.userId,
  });
}

async function listShoppingLists({ pageIndex, pageSize }, session) {
  const filter = session.role === 'Authorities' ? {} : { owner: session.userId };
  return shoppingListDao.list({ filter, pageIndex, pageSize });
}

async function getShoppingList(id, session) {
  const list = await shoppingListDao.findById(id);
  if (!list) {
    throw ShoppingListErrors.notFound();
  }

  enforceOwnership(session, list.owner);
  return list;
}

async function updateShoppingList({ id, name, items }, session) {
  const existing = await getShoppingList(id, session);

  const update = omitUndefined({ name, items });
  const updated = await shoppingListDao.updateById(existing.id, update);
  return updated;
}

async function deleteShoppingList(id, session) {
  await getShoppingList(id, session);
  await shoppingListDao.deleteById(id);
  return { id };
}

module.exports = {
  createShoppingList,
  listShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
};
