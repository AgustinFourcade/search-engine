const mongoose = require("mongoose");

const ProductWordSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

module.exports = mongoose.model("ProductWord", ProductWordSchema);
