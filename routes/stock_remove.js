const express = require("express");
const app = express();
const User = require("../models/user");
const getUserStocks = require("../middleware/getUserStocks");
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError')
const stockDelete = require('../middleware/stockDelete');
const updateStocks = require("../utils/updateStocks");

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

    stockDelete(username, ticker, newAmount);
    await updateStocks(username);

    const userStocks = await getUserStocks(username);
    res.json(userStocks);

  } catch (error) {
    next(new CustomError('Something went wrong', 500));
  }
});

module.exports = stock_remove;