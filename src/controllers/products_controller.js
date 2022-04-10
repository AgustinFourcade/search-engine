const application_controller = require("./application_controller");
const { indexProducts } = require("../helpers/indexation_helper");

const index = async (req) => {
  const response = await indexProducts(req.body.products);

  return { response };
};

module.exports = {
  ...application_controller,
  index
};
