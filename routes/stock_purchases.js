const express = require("express");
const app = express();
const User = require("../models/user");
const Stocks = require("../models/stocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');

const stocks_history = app.post("/stock_purchases", async (req, res, next) => {
  // send purchases history for given ticker to client
  const { authorization } = req.headers;
  const ticker = req.body.ticker;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");
  // auth user, if not found send back 403 err

  try {
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
    const purchaseHistory = foundStocks.purchaseHistory;
    if (purchaseHistory) {
      for (let i = 0; i < purchaseHistory.length; i++) {
        if (purchaseHistory[i].ticker === ticker) {
          const purchases = purchaseHistory[i].purchases;
          res.json(purchases);
          return;
        }
      }
      res.status(404);
      res.json({
        message: "Stocks not found",
      });
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