const express = require("express");
const app = express();
const fetch = require('node-fetch');
const User = require("../schemas/user")
const Stocks = require("../schemas/stocks")
const getCurrentDate = require("../functions/getCurrentDate");
const getUserStocks = require("../functions/getUserStocks");

const stock_add = app.post("/stock_add", async (req, res) => {
    // add stock to db
    const { authorization } = req.headers;  // username, password
    const stockItems = req.body.newStock;   // new stock object
    const ticker = stockItems.ticker.toUpperCase();
    const amount = stockItems.amount;
  
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
  
    const today = getCurrentDate();
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

    // get conversion rate from set currency -> user currency
    // if stock currency === user settings currency, conversion is 1
    let conversionRate = 1;
    if (stockInfoJson.chart.result[0].meta.currency === user.settings.currency) {
      conversionRate = 1;
    } else {
      const conversionRateSrc = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stockInfoJson.chart.result[0].meta.currency}${user.settings.currency}=X`)
      const conversionRateJson = await conversionRateSrc.json();
      conversionRate = conversionRateJson.chart.result[0].meta.previousClose;
    }
    
    // current price of stock in set currency
    const value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2);
    
    const stocks = await Stocks.findOne({ username: username }).exec();
    if (!stocks) {
      // if no stock history (first commit), create new object
      await Stocks.create({
        username: username,
        stocks: [{
          ticker: ticker, 
          amount: amount,
          prevClose: value,
        }],
        purchaseHistory: [{
          ticker: ticker,
          purchases: [
            {
              date: today,
              amount: amount,
              currentPrice: value,
              totalAmount: (value * amount).toFixed(2),
            }
          ]
        }],
        netWorthHistory: [{
          date: today,
          netWorth: (value * amount).toFixed(2)
        }],
        relativeChangeHistory: [{
          date: today,
          relativeChange: 1
        }],
        totalInvestedHistory: [{
          date: today,
          total: (value * amount).toFixed(2)
        }]
      });
      const userStocks = await getUserStocks(username);
      res.json(userStocks);

      return;
  
    } else {
      // if stock history, push to existing db
      const stockIndex = stocks.stocks.map(item => item.ticker).indexOf(ticker); // index of given ticker, if not exists, stockIndex = 1
      if (stockIndex === -1) {
        // stock ticker does not exist, push new
        stocks.stocks.push({
          ticker: ticker, 
          amount: amount,
          prevClose: value,
        });
        stocks.purchaseHistory.push({
          ticker: ticker,
          purchases: [
            {
              date: today,
              amount: amount,
              currentPrice: value,
              totalAmount: (value * amount).toFixed(2),
            }
          ]
        })
      } else {
        // stock ticker exists, add amount to existing object
        stocks.stocks[stockIndex].amount += parseInt(amount);
        stocks.purchaseHistory[stockIndex].purchases.push({
          ticker: ticker,
          date: today,
          amount: amount,
          currentPrice: value,
          totalAmount: (value * amount).toFixed(2),
        });
      }
      // increase total net worth by invested amount
      stocks.netWorthHistory.push({
        date: today,
        netWorth: (parseFloat(stocks.netWorthHistory[stocks.netWorthHistory.length - 1].netWorth) + parseFloat((value * amount))).toFixed(2)
      })

      // add purchase to investments history
      const investedIndex = stocks.totalInvestedHistory.map(item => item.date).indexOf(today);
      if (investedIndex === -1) {
        // if no purchase was made today
        stocks.totalInvestedHistory.push({
            date: today,
            total: (stocks.totalInvestedHistory[stocks.totalInvestedHistory.length - 1].total + parseFloat((value * amount))).toFixed(2)
          })
      } else {
        // if purchase was made today, increment in existing date
        stocks.totalInvestedHistory[investedIndex].total += parseFloat((value * amount).toFixed(2));
      }
      await stocks.save();
    }
    const userStocks = await getUserStocks(username);
    res.json(userStocks);
  });

  module.exports = stock_add;