const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const { addcomment } = require("../controllers/commentController");

const router = express.Router();

router.use(requireAuth);

router.post("/addcomment", addcomment);

module.exports = router;
