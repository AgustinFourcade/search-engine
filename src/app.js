const express = require("express");
const cors = require("cors");
const compression = require("compression");
// const { getCurrentInvoke } = require("@vendia/serverless-express");
const app = express();
require("./config/initializers");

const autosuggest_route = require("./routes/autosuggest_route");
const custom_measurement_route = require("./routes/custom_measurement_route");
const custom_spellfixing_route = require("./routes/custom_spellfixing_route");
const custom_stop_word_route = require("./routes/custom_stop_word_route");
const custom_stem_route = require("./routes/custom_stem_route");
const global_setting_route = require("./routes/global_setting_route");
const health_route = require("./routes/health_route");
const keyword_command_route = require("./routes/keyword_command_route");
const products_route = require("./routes/products_route");
const queries_route = require("./routes/queries_route");
const query_config_route = require("./routes/query_config_route");
const search_route = require("./routes/search_route");
const spelling_route = require("./routes/spelling_route");
const synonyms_route = require("./routes/synonyms_route");
const taxon_route = require("./routes/taxon_route");
const words_route = require("./routes/words_route");
const blacklisted_word_route = require("./routes/blacklisted_word_route");
const authentication_route = require("./routes/authentication_route");
const custom_autosuggest_route = require("./routes/custom_auto_suggest_route");

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use(
  "/",
  autosuggest_route,
  custom_measurement_route,
  custom_spellfixing_route,
  custom_stem_route,
  global_setting_route,
  health_route,
  keyword_command_route,
  products_route,
  queries_route,
  query_config_route,
  search_route,
  spelling_route,
  synonyms_route,
  taxon_route,
  words_route,
  blacklisted_word_route,
  authentication_route,
  custom_autosuggest_route,
  custom_stop_word_route
);

// Export your express server so you can import it in the lambda function.
module.exports = app;
