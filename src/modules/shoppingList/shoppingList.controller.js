const validateDtoIn = require('../../utils/validateDtoIn');
const { schemas, allowedKeys } = require('./shoppingList.validation');
const shoppingListService = require('./shoppingList.service');

async function create(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schemas.create, {
      allowedKeys: allowedKeys.create,
    });
    const data = await shoppingListService.createShoppingList(value, req.user);
    res.status(201).json({ data, uuAppErrorMap });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schemas.list, {
      allowedKeys: allowedKeys.list,
    });
    const result = await shoppingListService.listShoppingLists(value, req.user);
    res.status(200).json({
      data: {
        pageIndex: value.pageIndex,
        pageSize: value.pageSize,
        total: result.total,
        itemList: result.items,
      },
      uuAppErrorMap,
    });
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schemas.get, {
      allowedKeys: allowedKeys.get,
    });
    const data = await shoppingListService.getShoppingList(value.id, req.user);
    res.status(200).json({ data, uuAppErrorMap });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schemas.update, {
      allowedKeys: allowedKeys.update,
    });
    const data = await shoppingListService.updateShoppingList(value, req.user);
    res.status(200).json({ data, uuAppErrorMap });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { value, uuAppErrorMap } = validateDtoIn(req.body, schemas.delete, {
      allowedKeys: allowedKeys.delete,
    });
    const data = await shoppingListService.deleteShoppingList(value.id, req.user);
    res.status(200).json({ data, uuAppErrorMap });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  get,
  update,
  remove,
};
