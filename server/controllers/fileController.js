const fs = require("fs");
const { ObjectId } = require("mongodb");
const { getGfs, getGridfsBucket } = require("../utils/gridfsConfig");
const Contract = require("../models/contractModel");

const getallfiles = async (req, res) => {
  try {
    const gfs = getGfs();
    let files = await gfs.files.find().toArray();
    res.json({ files });
  } catch (err) {
    res.json({ err });
  }
};

const getfilebyname = async (req, res) => {
  try {
    const gfs = getGfs();
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file) {
      console.log("File not found");
      return res.status(404).json({ err: "No file exists" });
    }

    if (file.contentType === "application/pdf") {
      console.log("File found, starting stream...");
      const readstream = getGridfsBucket().openDownloadStreamByName(
        req.params.filename
      );

      readstream.on("error", (err) => {
        console.error("Stream error:", err);
        res.status(500).json({ err: err.message });
      });

      readstream.on("end", () => {
        console.log("Stream ended successfully");
      });
      res.setHeader("Content-Type", "application/pdf");
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not a PDF file" });
    }
  } catch (err) {
    console.error("Error finding file:", err);
    res.status(500).json({ err: err.message });
  }
};

const getfilebyId = async (req, res) => {
  console.log(`Searching for file: ${req.params.id}`);

  try {
    const gfs = getGfs();
    const fileId = new ObjectId(req.params.id);
    const file = await gfs.files.findOne({ _id: fileId });

    if (!file) {
      return res.status(404).json({ err: "No file exists" });
    }

    if (file.contentType === "application/pdf") {
      console.log("File found, starting stream...");

      const readstream = getGridfsBucket().openDownloadStream(file._id);

      res.setHeader("Content-Type", "application/pdf");

      readstream.on("error", (err) => {
        console.error("Stream error:", err);
        res.status(500).json({ err: err.message });
      });

      readstream.on("end", () => {
        console.log("Stream ended successfully");
      });

      readstream.pipe(res);
    } else {
      console.log("File is not a PDF");
      return res.status(404).json({ err: "Not a PDF file" });
    }
  } catch (err) {
    console.error("Error finding file:", err);
    res.status(500).json({ err: err.message });
  }
};

const deleteFileById = async (req, res) => {
  try {
    const gridfsBucket = getGridfsBucket();
    const fileId = new ObjectId(req.params.id);

    const gfs = getGfs();
    const file = await gfs.files.findOne({ _id: fileId });

    if (!file) {
      return res.status(404).json({ err: "File not found" });
    }

    await gridfsBucket.delete(fileId);

    res.json({ message: "File deleted successfully", fileId });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ err: err.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const contractId = req.params.contract_id;
    const gfs = getGfs();
    const file = await gfs.files.findOne({ _id: fileId });
    const contract = await Contract.findOne({ _id: contractId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    const updatedFields = {};
    if (req.body.filename) {
      updatedFields.filename = req.body.filename;
    }
    if (req.body.metadata) {
      updatedFields.metadata = {
        ...file.metadata,
        ...req.body.metadata,
      };
    }

    await gfs.files.updateOne({ _id: fileId }, { $set: updatedFields });
    await Contract.findOneAndUpdate(
      { _id: contractId },
      { filename: req.body.filename },
      { new: true }
    );

    res.json({ message: "File updated successfully", fileId });
  } catch (err) {
    console.error("Error updating file:", err);
    res.status(500).json({ error: err.message });
  }
};

const downloadFileById = async (req, res) => {
  console.log(`Downloading file with ID: ${req.params.filename}`);

  try {
    const gfs = getGfs();
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file) {
      console.log("File not found");
      return res.status(404).json({ err: "No file exists" });
    }

    res.set({
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    });

    const readstream = getGridfsBucket().openDownloadStream(file._id);

    readstream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ err: err.message });
    });

    readstream.on("end", () => {
      console.log("File downloaded successfully");
    });

    readstream.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getallfiles,
  getfilebyId,
  deleteFileById,
  updateFile,
  downloadFileById,
  getfilebyname,
};
