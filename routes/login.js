const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../schemas/user")

const login = app.post("/login", async (req, res) => {
    // validate user account on login
  
    const {username, password} = req.body;
    // find if user exists, if not send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user) {
      res.status(403);
      res.json({
        message: "User does not exist",
      });
      return;
    }
    // validate password, if invalid send back 403 err
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (user && !passwordIsValid) {
      res.status(403);
      res.json({
        message: "Wrong password",
      });
      return;
    }
  
    res.json({
      message: "Success",
      username: username,
      password: user.password
    });
  });

  module.exports = login;