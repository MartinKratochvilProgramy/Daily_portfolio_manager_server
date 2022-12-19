const express = require("express");
const app = express();
const User = require("../models/user");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');

const set_theme = app.post("/set_theme", async (req, res, next) => {
  // change theme
  const { authorization } = req.headers;
  const theme = req.body.theme;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [, token] = auth.split(":");

  try {
    // auth user, if not found send back 403 err
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).exec();

    if (!user) {
      res.status(403);
      res.json({
        message: "Invalid access",
      });
      return;
    }

    user.settings.theme = theme;
    await user.save();

  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }

});

module.exports = set_theme;