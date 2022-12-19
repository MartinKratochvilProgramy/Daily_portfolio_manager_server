const Stocks = require("../models/stocks")
const getCurrentDate = require("../utils/getCurrentDate");
const getUserStocks = require("./getUserStocks");

async function createNewStock(
    username,
    ticker,
    amount,
    value,
) {

    const today = getCurrentDate();

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
}

async function addToExistingStock(
    stocks,
    ticker,
    amount,
    value,
) {
    const today = getCurrentDate();

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

module.exports = { createNewStock, addToExistingStock };