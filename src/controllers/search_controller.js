const { performSearch } = require("../helpers/search_helper");
const application_controller = require("./application_controller");
const ProductViews = require("../models/product_view");

const index = async (req) => {
  const { view_name, text } = req.query;

  const response = await performSearch({ text });

  response.views = await ProductViews.views(response.all_product_ids, view_name);

  return { response };
};

module.exports = {
  ...application_controller,
  index,
};
