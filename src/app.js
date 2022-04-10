const express = require("express");
const compression = require("compression");
const app = express();
require("./config/initializers");

const health_route = require("./routes/health_route");
const products_route = require("./routes/products_route");
const search_route = require("./routes/search_route");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", health_route, products_route, search_route);

module.exports = app;
