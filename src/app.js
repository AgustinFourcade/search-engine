const express = require("express");
const compression = require("compression");
const app = express();
require("./config/initializers");

// const autosuggest_route = require("./routes/autosuggest_route");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use(
  "/",
  // autosuggest_route,
);

// Export your express server so you can import it in the lambda function.
module.exports = app;
