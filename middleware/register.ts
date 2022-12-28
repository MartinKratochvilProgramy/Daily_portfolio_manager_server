import { Request, Response } from 'express';
import { getCurrentDate } from "../utils/getCurrentDate";
const bcrypt = require("bcrypt");
const User = require("../models/user")
const Stocks = require("../models/stocks")
const { createToken } = require('../utils/jwt')

export const register = async (req: Request, res: Response) => {
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

  try {
    // create user in db with hashed password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    await User.create({ username, password, settings });
    const today = getCurrentDate();
    await Stocks.create({
      username: username,
      stocks: [],
      purchaseHistory: [],
      netWorthHistory: [{
        date: today,
        netWorth: 0
      }],
      relativeChangeHistory: [{
        date: today,
        relativeChange: 1
      }],
      totalInvestedHistory: [{
        date: today,
        total: 0
      }]
    });

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
  } catch (error) {
    console.log(error);
  }
};