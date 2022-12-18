const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { createToken } = require('../utils/jwt')

const register = app.post("/register", async (req, res) => {
  // create user account, return 500 err if no password or username given
  let { username, password, settings } = req.body;

  // find if user exists, if yes send 500 err
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    res.status(500);
    res.json({
      message: "User already exists",
    });
    return;
  }
  // create user in db with hashed password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  await User.create({ username, password, settings });

  const user = await User.findOne({ username }).exec();

  const accessToken = createToken({
    id: user._id,
  })

  res.json({
    message: "Success",
    username: username,
    settings: settings,
    token: accessToken
  });
});

module.exports = register;