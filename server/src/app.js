const express = require("express");
const cors = require("cors");

const { api_v1 } = require("./routes/api_v1")

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json());

app.use("/v1", api_v1);

module.exports = app;