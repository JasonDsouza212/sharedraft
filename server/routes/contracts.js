const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

router.post(
  "/uploadcontract",
  upload.single("file"),
  uploadContract,
  (err, req, res, next) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size exceeds 1 MB limit" });
        }
      } else {
        return res.status(400).json({ error: err.message });
      }
    }
  }
);

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
