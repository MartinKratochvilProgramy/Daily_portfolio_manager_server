const express = require("express");
const app = express();
const User = require("../models/user");
const Stocks = require("../models/stocks");
const updateStocks = require("../utils/updateStocks");
const getUserStocks = require("../middleware/getUserStocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError')

const stock_remove = app.post("/stock_remove", async (req, res, next) => {
  // remove stock from db
  const { authorization } = req.headers;
  const ticker = req.body.ticker;
  const newAmount = req.body.amount;

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
        message: "invalid access",
      });
      return;
    }

    const stocks = await Stocks.findOne({ username: username }).exec();
    if (!stocks) {
      res.status(403);
      res.json({
        message: "invalid access",
      });
      return;
    }

    let newStocks;
    if (newAmount === 0) {
      newStocks = stocks.stocks.filter((stock) => stock.ticker !== ticker);
    } else if (newAmount > 0) {
      newStocks = stocks.stocks;
      const objIndex = stocks.stocks.findIndex((stocks => stocks.ticker === ticker));
      newStocks[objIndex].amount = newAmount;
    }

    stocks.stocks = newStocks;

    await stocks.save();
    // update net worth
    await updateStocks(username);

    const userStocks = await getUserStocks(username);
    res.json(userStocks);

  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }
});

module.exports = stock_remove;