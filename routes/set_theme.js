const express = require("express");
const app = express();
const User = require("../schemas/user")

const set_theme = app.post("/set_theme", async (req, res) => {
    // change theme
    const { authorization } = req.headers;
    const theme = req.body.theme;

    // get username password from headers
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    // auth user, if not found send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res.status(403);
      res.json({
        message: "Invalid access",
      });
      return;
    }

    user.settings.theme = theme;
    await user.save();

  });

  module.exports = set_theme;