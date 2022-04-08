const { Router } = require("express");
const router = Router();

router.get("/health", (req, res) => {
  res.send("Health OK! - Search Engine by Agustin Fourcade");
});

module.exports = router;
