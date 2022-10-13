const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../schemas/user")

const register = app.post("/register", async (req, res) => {
    // create user account, return 500 err if no password or username given
    let {username, password} = req.body;
  
    // find if user exists, if yes send 500 err
    const user = await User.findOne({ username }).exec();
    if (user) {
      res.status(500);
      res.json({
        message: "User already exists",
      });
      return;
    }
    // create user in db with hashed password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    await User.create({ username, password });
  
    res.json({  
      message: "Success",
      username: username,
      password: password
    });
  });

  module.exports = register;