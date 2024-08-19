const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const requireAuth = require("../middleware/requireAuth");
const { addcomment } = require("../controllers/commentController");

const {
  uploadContract,
  createcontract,
  getContractWithComments,
  grantaccess,
  getallusercontract,
  getallexternalcontracts,
  get_all_contracts_that_user_has_access,
  getContractComments,
  getusers,
  getsharedcontract,
} = require("../controllers/contractController");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return cb(err);
      }
      const filename = buf.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1 MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/sharedcontractlink/:hashedcontractid", getsharedcontract);

router.use(requireAuth);

router.post("/uploadcontract", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  uploadContract(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ file: req.file });
  });
});

router.get("/users", getusers);
router.get("/:userId", getallusercontract);
router.get("/externalcontracts/:userId", getallexternalcontracts);
router.get("/allcontracts/:userId", get_all_contracts_that_user_has_access);

router.post("/createcontract", createcontract);

router.post("/contract/:contract_id/addcomment/", addcomment);
router.get(
  "/contract/:contract_id/getcontractwithcomments/",
  getContractWithComments
);
router.get("/contract/:contract_id/getContractComments/", getContractComments);
router.put("/contract/:contract_id/grantaccess", grantaccess);

module.exports = router;
