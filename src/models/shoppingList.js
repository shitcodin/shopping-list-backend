const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: String, required: true, index: true },
    items: { type: [String], default: [], index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ShoppingListSchema.method('toDto', function toDto() {
  const doc = this.toObject({ versionKey: false });
  doc.id = doc._id.toString();
  delete doc._id;
  return doc;
});

ShoppingListSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
