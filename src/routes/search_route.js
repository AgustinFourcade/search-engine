const { Router } = require("express");
const router = Router();
const search_controller = require("../controllers/search_controller");

router.get(
  "/search",
  search_controller.wrapped_method(search_controller.index)
);

module.exports = router;
