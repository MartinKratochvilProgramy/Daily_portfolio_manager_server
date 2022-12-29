"use strict";
exports.__esModule = true;
exports.Stocks = void 0;
var mongoose = require('mongoose');
var stocksSchema = new mongoose.Schema({
    username: String,
    stocks: [
        {
            ticker: String,
            amount: Number,
            prevClose: Number
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
});
exports.Stocks = mongoose.model("Stocks", stocksSchema);
