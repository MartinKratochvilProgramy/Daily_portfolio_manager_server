const express = require("express");
const app = express();
const User = require("../models/user")
const Stocks = require("../models/stocks");
const { verifyToken } = require("../utils/jwt");

const investments_history = app.get("/investments_history", async (req, res) => {
  // send invested amounts to client
  const { authorization } = req.headers;

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");
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
  if (foundInvestments) {
    const investments = foundInvestments.totalInvestedHistory;
    res.json(investments);
  } else {

    res.status(404);
    res.json({
      message: "Stocks not found",
    });
  }
});

module.exports = investments_history;