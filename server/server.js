const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
require("dotenv").config();
const { init } = require("./utils/gridfsConfig");
const contractRoutes = require("./routes/contracts");

const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/file");

const app = express();

app.use(express.json());

const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(methodOverride("_method"));

app.use("/api/user", userRoutes);
app.use("/api/contracts", contractRoutes);

app.use("/api/files", fileRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    init(conn.connection.db);

    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });
