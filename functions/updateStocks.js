const Stocks = require("../schemas/stocks");
const fetch = require('node-fetch');
const getCurrentDate = require("./getCurrentDate");

const updateStocks = async (username) => {
    // loop through all user's stocks and update prev close
    // calculate total net worth and push it to netWorthHistory
    // calculate relative change in net worth and push it to relativeChangeHistory

    const stocks = await Stocks.findOne({ username: username }).exec();
    let totalNetWorth = 0;
    for (let i = 0; i < stocks.stocks.length; i++) {
      const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stocks.stocks[i].ticker}`)
      const stockInfoJson = await stockInfo.json()
  
      // get conversion rate from set currency -> dollar
      // TODO: add a way for the user to select his own currency
      const conversionRate = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stockInfoJson.chart.result[0].meta.currency}USD=X`)
      const conversionRateJson = await conversionRate.json();
  
      // prev close value of stock in set currency
      // TODO: add a way for the user to select his own currency
      const prevClose = (stockInfoJson.chart.result[0].meta.previousClose * conversionRateJson.chart.result[0].meta.previousClose).toFixed(2);
      stocks.stocks[i].prevClose = prevClose;
      
      totalNetWorth += prevClose * conversionRateJson.chart.result[0].meta.previousClose * stocks.stocks[i].amount;
    }

    const today = getCurrentDate();

    stocks.netWorthHistory.push({
      date: today,
      netWorth: parseFloat((totalNetWorth).toFixed(2))
    })
    await stocks.save()

    console.log("updating stocks for user " + username);
  
    const response = "updating stocks for user " + username;
    return response;
  }

  module.exports = updateStocks;