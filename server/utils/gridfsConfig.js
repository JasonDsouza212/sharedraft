const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;
let gridfsBucket;

const init = (db) => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });
  gfs = Grid(db, mongoose.mongo);
  gfs.collection("uploads");
};

module.exports = {
  init,
  getGfs: () => gfs,
  getGridfsBucket: () => gridfsBucket,
};
