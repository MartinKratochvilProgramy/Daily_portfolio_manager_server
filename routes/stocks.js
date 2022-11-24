const express = require("express");
const app = express();
const User = require("../schemas/user")
const Stocks = require("../schemas/stocks")

const stocks = app.get("/stocks", async (req, res) => {
    // send stocks to client
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
    const foundStocks = await Stocks.findOne({ username: username }).exec();
    if (foundStocks) {
      const stocks = foundStocks.stocks;
      const purchaseHistory = foundStocks.purchaseHistory;

      const response = [];

      for (let i = 0; i < stocks.length; i++) {
        // construct array of stock objects {ticker, amount, prevClose, _id, firstPurchase, lastPurchase}
        const stockObject = {};
        stockObject.ticker = stocks[i].ticker;
        stockObject.amount = stocks[i].amount;
        stockObject.prevClose = stocks[i].prevClose;
        stockObject._id = stocks[i]._id;

        const ticker = stockObject.ticker;
        const index = purchaseHistory.findIndex(stock => stock.ticker === ticker);
        
        stockObject.firstPurchase = purchaseHistory[index].purchases[0].date;                                          // first known purchase history
        stockObject.lastPurchase = purchaseHistory[index].purchases[purchaseHistory[index].purchases.length - 1].date; // last known purchase history

        response.push(stockObject)
      }
      res.json(response);
    } else {
      res.status(404);
      res.json({
        message: "Stocks not found",
      });
    }
  });

  module.exports = stocks;