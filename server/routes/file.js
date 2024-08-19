const express = require("express");
const crypto = require("crypto");
const path = require("path");
const requireAuth = require("../middleware/requireAuth");

const {
  getallfiles,
  getfilebyId,
  deleteFileById,
  updateFile,
  downloadFileById,
  getfilebyname,
} = require("../controllers/fileController");
const router = express.Router();

router.get("/", getallfiles);
router.get("/:id", getfilebyId);
router.get("/filename/:filename", getfilebyname);
router.delete("/:id", deleteFileById);
router.put("/:contract_id/:id", updateFile);
router.get("/download/:filename", downloadFileById);

module.exports = router;
