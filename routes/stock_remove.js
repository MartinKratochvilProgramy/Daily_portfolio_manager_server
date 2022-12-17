const express = require("express");
const app = express();
const User = require("../schemas/user");
const Stocks = require("../schemas/stocks");
const updateStocks = require("../utils/updateStocks");
const getUserStocks = require("../utils/getUserStocks");
const { verifyToken } = require("../utils/jwt");

const stock_remove = app.post("/stock_remove", async (req, res) => {
  // remove stock from db
  const { authorization } = req.headers;
  const ticker = req.body.ticker;
  const newAmount = req.body.amount;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");
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
});

module.exports = stock_remove;