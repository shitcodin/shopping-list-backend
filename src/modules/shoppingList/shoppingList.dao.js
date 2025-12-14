const ShoppingList = require('../../models/shoppingList');

async function create(data) {
  const doc = await ShoppingList.create(data);
  return doc.toDto();
}

async function findById(id) {
  const doc = await ShoppingList.findById(id).lean({ versionKey: false });
  if (!doc) return null;
  return { ...doc, id: doc._id.toString() };
}

async function list({ filter = {}, pageIndex = 0, pageSize = 50 }) {
  const skip = pageIndex * pageSize;

  const [items, total] = await Promise.all([
    ShoppingList.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean({ versionKey: false }),
    ShoppingList.countDocuments(filter),
  ]);

  const normalized = items.map((doc) => ({ ...doc, id: doc._id.toString() }));

  return { items: normalized, total };
}

async function updateById(id, update) {
  const doc = await ShoppingList.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean({ versionKey: false });

  if (!doc) return null;
  return { ...doc, id: doc._id.toString() };
}

async function deleteById(id) {
  return ShoppingList.findByIdAndDelete(id).lean({ versionKey: false });
}

module.exports = {
  create,
  findById,
  list,
  updateById,
  deleteById,
};
