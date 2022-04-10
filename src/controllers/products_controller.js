const application_controller = require("./application_controller");
const { indexProducts } = require("../helpers/indexation_helper");
const Product = require("../models/product");

const index = async (req) => {
  const response = await indexProducts(req.body.products);

  return { response };
};

const create = async (req) => {
  const response = await Product.add();

  return { response };
};

module.exports = {
  ...application_controller,
  create,
  index
};
