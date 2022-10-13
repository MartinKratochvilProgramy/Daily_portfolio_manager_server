const express = require("express");
const app = express();
const User = require("../schemas/user")
const Stocks = require("../schemas/stocks")

const stocks_history = app.post("/stock_purchases", async (req, res) => {
    // send purchases history for given ticker to client
    const { authorization } = req.headers;
    const ticker = req.body.ticker;
  
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
  });

  module.exports = stocks_history;