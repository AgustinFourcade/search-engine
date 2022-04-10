const mongoose = require("mongoose");

const ProductViewSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

ProductViewSchema.statics.views = async function (ids, name = "default") {
  if (!ids) {
    return [];
  }
  return (
    await this.find({ product_id: { $in: ids }, name }, { _id: 0 }).exec()
  )
    .sort((a, b) => ids.indexOf(a.product_id) - ids.indexOf(b.product_id))
    .map((e) => e.content);
};

module.exports = mongoose.model("ProductView", ProductViewSchema);
