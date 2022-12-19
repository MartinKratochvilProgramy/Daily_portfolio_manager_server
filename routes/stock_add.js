const express = require("express");
const app = express();
const fetch = require('node-fetch');
const User = require("../models/user")
const Stocks = require("../models/stocks")
const getUserStocks = require("../middleware/getUserStocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError')
const { createNewStock, addToExistingStock } = require('../middleware/stockAdd');
const getConversionRate = require('../utils/getConversionRate');

const stock_add = app.post("/stock_add", async (req, res, next) => {
  // add stock to db
  const stockItems = req.body.newStock;   // new stock object
  const ticker = stockItems.ticker.toUpperCase();
  const amount = stockItems.amount;

  const { authorization } = req.headers;
  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");

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

    // get stocks ticker, if not exists, return
    const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`)
    const stockInfoJson = await stockInfo.json()
    if (!stockInfoJson.chart.result) {
      res.status(403);
      res.json({
        message: "Ticker not found",
      });
      return;
    }

    // current price of stock in set currency
    const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, user.settings.currency);
    const value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2);
    const stocks = await Stocks.findOne({ username: username }).exec();

    if (!stocks) {
      await createNewStock(username, ticker, amount, value);

      res.json(await getUserStocks(username));
      return;

    } else {
      await addToExistingStock(stocks, ticker, amount, value);

      res.json(await getUserStocks(username));
      return;
    }
  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }
});

module.exports = stock_add;