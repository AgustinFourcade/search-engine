const express = require("express");
const compression = require("compression");
const app = express();
require("./config/initializers");

const health_route = require("./routes/health_route");
const products_route = require("./routes/products_route");
const search_route = require("./routes/search_route");
const spelling_route = require("./routes/spelling_route");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", health_route, products_route, search_route, spelling_route);

module.exports = app;
