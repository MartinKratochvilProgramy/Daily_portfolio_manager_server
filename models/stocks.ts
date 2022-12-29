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
  relativeChangeHistory: [
    {
      date: String,
      relativeChange: Number
    }
  ],
  totalInvestedHistory: [
    {
      date: String,
      total: Number
    }
  ]
})

export const Stocks = mongoose.model("Stocks", stocksSchema);