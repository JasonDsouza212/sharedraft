// controllers/fileController.js
const fs = require("fs");
const { getGridfsBucket } = require("../utils/gridfsConfig");
const CryptoJS = require("crypto-js");

const Contract = require("../models/contractModel");
const User = require("../models/userModel");

const axios = require("axios");

const uploadContract = async (req, res) => {
  const gridfsBucket = getGridfsBucket();

  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are allowed." });
  }

  const writestream = gridfsBucket.openUploadStream(req.file.filename, {
    contentType: req.file.mimetype,
    metadata: {
      userid: req.body.userId,
    },
  });

  const fileId = writestream.id;

  fs.createReadStream(req.file.path)
    .pipe(writestream)
    .on("finish", async () => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        }
      });

      const filedata = {
        filename: req.file.filename,
        fileId,
        userId: req.body.userId,
      };

      const response = await fetch(
        `${process.env.SERVER_BASE_URL}/api/contracts/createcontract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
          body: JSON.stringify(filedata),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      res.json({ file: req.file, fileId });
    })
    .on("error", (err) => {
      console.error("Error uploading file:", err);
      res.status(500).json({ err: err.message });
    });
};

const getusers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createcontract = async (req, res) => {
  try {
    const { filename, fileId, userId } = req.body;

    if (!filename || !fileId) {
      return res
        .status(400)
        .json({ error: "Filename and File ID are required" });
    }

    const existingFile = await Contract.findOne({ fileId });
    if (existingFile) {
      return res
        .status(400)
        .json({ error: "A document with this File ID already exists" });
    }

    const newContract = await Contract.create({
      filename,
      fileId,
      contentType: "application/pdf",
      userId,
    });

    console.log("uploaded successfully");

    res
      .status(200)
      .json({ message: "Contract created successfully", data: newContract });
  } catch (err) {
    console.error("Error creating contract:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getContractWithComments = async (req, res) => {
  const contractId = req.params.contract_id;

  try {
    const contract = await Contract.findById(contractId)
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .populate("userId");

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json({ contract });
  } catch (error) {
    console.error("Error fetching contract with comments:", error);
    res.status(500).json({ message: "Error fetching contract with comments" });
  }
};

const getContractComments = async (req, res) => {
  const contractId = req.params.contract_id;

  try {
    const contract = await Contract.findById(contractId)
      .select("comments")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json({ comments: contract.comments });
  } catch (error) {
    console.error("Error fetching contract comments:", error);
    res.status(500).json({ message: "Error fetching contract comments" });
  }
};

const grantaccess = async (req, res) => {
  const contractId = req.params.contract_id;
  const userEmailToProvideAccess = req.body.userEmail;

  try {
    const user = await User.findOne({ email: userEmailToProvideAccess });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    const contract = await Contract.findOne({ _id: contractId });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contract.userId.equals(userId)) {
      return res.status(400).json({ error: "Owner always has access" });
    }

    if (contract.accessed_user.some((id) => id.equals(userId))) {
      return res.status(400).json({
        error: `${userEmailToProvideAccess} already has access to this contract`,
      });
    }

    const updatedContract = await Contract.findOneAndUpdate(
      { _id: contractId },
      { $push: { accessed_user: userId } },
      { new: true }
    );

    res.status(200).json({
      message: `Access provided successfully for ${userEmailToProvideAccess}`,
      contract: updatedContract,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const getallusercontract = async (req, res) => {
  const userId = req.params.userId;

  try {
    const objectId = userId;

    const userContracts = await Contract.find({ userId: objectId }).populate(
      "userId"
    );

    res.status(200).json(userContracts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const getallexternalcontracts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const objectId = userId;

    const contracts = await Contract.find({ accessed_user: objectId }).populate(
      "userId"
    );

    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const getsharedcontract = async (req, res) => {
  try {
    const { hashedcontractid } = req.params;
    const uniqueKey = process.env.REACT_HASH_KEY;

    if (!uniqueKey) {
      return res.status(500).json({ error: "Unique key not found" });
    }

    const contracts = await Contract.find()
      .populate({
        path: "userId",
        select: "_id email name",
      })
      .populate("comments");

    const contract = contracts.find((contract) => {
      const hash = CryptoJS.HmacSHA256(
        contract._id.toString(),
        uniqueKey
      ).toString();
      return hash === hashedcontractid;
    });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.json({ contract });
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const get_all_contracts_that_user_has_access = async (req, res) => {
  const userId = req.params.userId;

  try {
    const objectId = userId;

    const contracts = await Contract.find({
      $or: [{ accessed_user: objectId }, { userId: objectId }],
    }).populate("userId");

    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

module.exports = {
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
};
