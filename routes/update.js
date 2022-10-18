const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const update = app.post("/update", async (req, res) => {
  
    const { input } = req.body;

    res.json({
      message: "Success",
      input: input,
    });
  });

  module.exports = update;