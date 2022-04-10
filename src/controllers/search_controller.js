const { performSearch } = require("../helpers/search_helper");
const application_controller = require("./application_controller");

const index = async (req) => {
  const response = await performSearch(req.query);

  return { response };
};

module.exports = {
  ...application_controller,
  index,
};
