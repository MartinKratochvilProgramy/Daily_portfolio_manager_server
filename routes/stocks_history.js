const express = require("express");
const app = express();
const User = require("../models/user");
const Stocks = require("../models/stocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');

const stocks_history = app.get("/stocks_history", async (req, res, next) => {
  // send stocks to client
  const { authorization } = req.headers;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");

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
    const foundStocks = await Stocks.findOne({ username: username }).exec();
    if (foundStocks) {
      const stocks = foundStocks.netWorthHistory;
      res.json(stocks);
    } else {

      res.status(404);
      res.json({
        message: "Stocks not found",
      });
    }

  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }
});

module.exports = stocks_history;