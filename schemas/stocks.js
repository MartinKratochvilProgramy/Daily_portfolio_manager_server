const mongoose = require('mongoose')

const stocksSchema = new mongoose.Schema({
    username: String,
    stocks: [
      {
        ticker: String,
        amount: Number,
        prevClose: Number,
      }
    ],
    purchaseHistory: [
      {
        ticker: String,
        purchases: [
          {
            date: String,
            amount: Number,
            currentPrice: Number,
            totalAmount: Number
          }
        ]
      }
    ],
    netWorthHistory: [
      {
        date: String,
        netWorth: Number
      }
    ],
    totalInvestedHistory: [
      {
        date: String,
        total: Number
      }
    ]
  })
  const Stocks = mongoose.model("Stocks", stocksSchema);

  module.exports = Stocks;