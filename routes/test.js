const express = require("express");
const app = express();

const test = app.get("/test", async (req, res) => {
    res.json("hello world");
  });

  module.exports = test;