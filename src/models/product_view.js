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

module.exports = mongoose.model("ProductView", ProductViewSchema);
