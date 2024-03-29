const { Router } = require("express");
const router = Router();

const products_controller = require("../controllers/products_controller");

router.post(
  "/products/create",
  products_controller.wrapped_method(products_controller.index)
);

module.exports = router;
