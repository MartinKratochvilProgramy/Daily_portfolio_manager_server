const express = require("express");
const app = express();
const User = require("../schemas/user");
const Stocks = require("../schemas/stocks");
const updateStocks = require("../functions/updateStocks");

const stock_remove = app.post("/stock_remove", async (req, res) => {
    // remove stock from db
    const { authorization } = req.headers;
    const ticker = req.body.ticker;
    const newAmount = req.body.amount;
  
    // get username password from headers
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    // auth user, if not found send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
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
      newStocks = stocks.stocks.filter((stock) => stock.ticker !== ticker)
    } else if (newAmount > 0) {
      newStocks = stocks.stocks;
      const objIndex = stocks.stocks.findIndex((stocks => stocks.ticker === ticker));
      newStocks[objIndex].amount = newAmount;
    }

    stocks.stocks = newStocks;
  
    await stocks.save();
    await updateStocks(username);
    res.json(stocks.stocks);
  });

  module.exports = stock_remove;