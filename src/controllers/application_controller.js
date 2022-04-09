const { getClient } = require("../helpers/mongo_client");
getClient();

const _invoque_method = async (req, res, callback) => {
  try {
    const { response, status = 200 } = await callback(req);
    console.log("RESPONSE", response, status);
    res.status(status).send(response);
    return { response, status };
  } catch (e) {
    console.log("LOG: ", e.tag ? e.error.stack : e.stack);
    res.status(500).send({ error: e.tag ? e.error.message : e.message });
  }
};

const wrapped_method = (callback) => {
  return async (req, res) => {
    _invoque_method(req, res, callback);
  };
};

module.exports = { wrapped_method };
