const application_controller = require("./application_controller");

const test = async (req) => {
  console.log("estoy acá");
  let response = "test";
  return { response };
};

module.exports = {
  ...application_controller,
  test,
};
