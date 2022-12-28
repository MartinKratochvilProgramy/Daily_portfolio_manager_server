import { Request, Response } from 'express';
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { createToken } = require('../utils/jwt')

export const login = async (req: Request, res: Response) => {
  // validate user account on login

  const { username, password } = req.body;
  // find if user exists, if not send back 403 err
  const user = await User.findOne({ username }).exec();
  if (!user) {
    res.status(403);
    res.json({
      message: "User does not exist",
    });
    return;
  }

  try {
    // validate password, if invalid send back 403 err
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (user && !passwordIsValid) {
      res.status(403);
      res.json({
        message: "Wrong password",
      });
      return;
    }

    const accessToken = createToken({
      id: user._id,
    })

    res
      .json({
        message: "Success",
        username: username,
        settings: user.settings,
        token: accessToken
      });

  } catch (error) {
    console.log(error);
  }
};