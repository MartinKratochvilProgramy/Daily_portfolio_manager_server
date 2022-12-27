const express = require("express");
const app = express();
const User = require("../models/user");
const Stocks = require("../models/stocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');
const getCurrentDate = require("../utils/getCurrentDate");

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
    if (foundStocks.netWorthHistory.length > 0) {
      // user has some history
      const stocks = foundStocks.netWorthHistory;
      const result = [];
      // strip _id propety from stocks
      for (let i = 0; i < stocks.length; i++) {
        result.push({
          date: stocks[i].date,
          netWorth: stocks[i].netWorth
        })
      }

      res.json(result);

    } else if (foundStocks.netWorthHistory.length === 0) {
      // user history is empty
      res.json([{
        date: getCurrentDate(),
        netWorth: 0,
      }])

    } else {

      res.status(404);
      res.json({
        message: "Stocks history not found",
      });
    }

  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }
});

module.exports = stocks_history;