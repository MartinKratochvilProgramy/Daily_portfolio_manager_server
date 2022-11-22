const express = require("express");
const app = express();

const stocks = app.get("/test", async (req, res) => {
    res.json("hello world");
  });

  module.exports = stocks;