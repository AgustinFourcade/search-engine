const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    application_id: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

ProductSchema.statics.add = async function () {
  let product = {
    application_id: "test",
    product_id: 1,
    name: "jabon",
  };

  product = await new this(product).save();

  return product;
};

module.exports = mongoose.model("Product", ProductSchema);
