const mongoose = require("mongoose");

const ProductTaxonSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    taxon_id: {
      type: String,
      required: true,
    },
    taxonomy_name: {
      type: String,
      required: true,
    },
    taxon_name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    leaf: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

module.exports = mongoose.model("ProductTaxon", ProductTaxonSchema);
