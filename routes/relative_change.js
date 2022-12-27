const express = require("express");
const app = express();
const User = require("../models/user")
const Stocks = require("../models/stocks")
const { verifyToken } = require("../utils/jwt");
const CustomError = require('../models/CustomError');
const getCurrentDate = require("../utils/getCurrentDate");

const relative_change = app.get("/relative_change", async (req, res, next) => {
  // send invested amounts to client
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
    const foundInvestments = await Stocks.findOne({ username: username }).exec();

    if (foundInvestments.relativeChangeHistory.length > 0) {
      // user has some history
      const relativeChangeHistory = foundInvestments.relativeChangeHistory;
      const result = [];
      // strip _id propety from stocks
      for (let i = 0; i < relativeChangeHistory.length; i++) {
        result.push({
          date: relativeChangeHistory[i].date,
          relativeChange: relativeChangeHistory[i].relativeChange
        })
      }

      res.json(result);

    } else if (foundInvestments.relativeChangeHistory.length === 0) {
      // user history is empty
      res.json([{
        date: getCurrentDate(),
        relativeChange: 1,
      }])

    } else {

      res.status(404);
      res.json({
        message: "Relative change not found",
      });
    }
  } catch (error) {
    console.log(error);
    next(new CustomError('Something went wrong', 500))
  }
});

module.exports = relative_change;