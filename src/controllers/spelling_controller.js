const application_controller = require("./application_controller");
const Word = require("../models/word");

const safe_params = (req) => {
  const params = req.body.application_id ? req.body : req.query;
  const whitelist = ["text"];

  return Object.keys(params)
    .filter((key) => whitelist.indexOf(key) >= 0)
    .reduce((res, key) => ((res[key] = params[key]), res), {});
};

const index = async (req) => {
  const { text } = safe_params(req);
  const response = await Word.spelling(text);

  return { response };
};

module.exports = { ...application_controller, safe_params, index };
