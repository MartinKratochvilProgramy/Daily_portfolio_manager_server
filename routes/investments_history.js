const express = require("express");
const app = express();
const User = require("../schemas/user")
const Stocks = require("../schemas/stocks")

const investments_history = app.get("/investments_history", async (req, res) => {
    // send invested amounts to client
    const { authorization } = req.headers;
  
    // get username password from headers
    const [, token] = authorization.split(" ");
    const [username, password] = token.split(":");
    // auth user, if not found send back 403 err
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
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