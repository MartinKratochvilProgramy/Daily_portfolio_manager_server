import { Request, Response } from 'express';
const User = require("../models/user");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');

export const set_theme = async (req: Request, res: Response) => {
  // change theme
  const { authorization } = req.headers;

  if (!authorization) {
    res.json({
      message: "Invalid header"
    })
    return;
  }

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
    console.log(error);

  }

};