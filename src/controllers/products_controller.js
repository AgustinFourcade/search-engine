const application_controller = require("./application_controller");
const Product = require("../models/product");

const create = async (req) => {
  const response = await Product.add();

  return { response };
};

module.exports = {
  ...application_controller,
  create,
};
