const { Router } = require("express");
const router = Router();

const spelling_controller = require("../controllers/spelling_controller");

router.get(
  "/spelling",
  spelling_controller.wrapped_method(spelling_controller.index)
);

module.exports = router;
