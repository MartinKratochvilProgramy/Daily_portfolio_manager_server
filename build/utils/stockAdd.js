"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addToExistingStock = exports.createNewStock = void 0;
var getCurrentDate_1 = require("../utils/getCurrentDate");
var Stocks = require("../models/stocks");
var createNewStock = function (username, ticker, amount, value) { return __awaiter(void 0, void 0, void 0, function () {
    var today;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                today = (0, getCurrentDate_1.getCurrentDate)();
                // if no stock history (first commit), create new object
                return [4 /*yield*/, Stocks.create({
                        username: username,
                        stocks: [{
                                ticker: ticker,
                                amount: amount,
                                prevClose: value
                            }],
                        purchaseHistory: [{
                                ticker: ticker,
                                purchases: [
                                    {
                                        date: today,
                                        amount: amount,
                                        currentPrice: value,
                                        totalAmount: (value * amount).toFixed(2)
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
                    })];
            case 1:
                // if no stock history (first commit), create new object
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createNewStock = createNewStock;
var addToExistingStock = function (stocks, ticker, amount, value) { return __awaiter(void 0, void 0, void 0, function () {
    var today, stockIndex, investedIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                today = (0, getCurrentDate_1.getCurrentDate)();
                stockIndex = stocks.stocks.map(function (item) { return item.ticker; }).indexOf(ticker);
                if (stockIndex === -1) {
                    // stock ticker does not exist, push new
                    stocks.stocks.push({
                        ticker: ticker,
                        amount: amount,
                        prevClose: value
                    });
                    stocks.purchaseHistory.push({
                        ticker: ticker,
                        purchases: [
                            {
                                date: today,
                                amount: amount,
                                currentPrice: value,
                                totalAmount: parseFloat((value * amount).toFixed(2))
                            }
                        ]
                    });
                }
                else {
                    // stock ticker exists, add amount to existing object
                    stocks.stocks[stockIndex].amount += parseInt(amount.toString());
                    stocks.purchaseHistory[stockIndex].purchases.push({
                        date: today,
                        amount: amount,
                        currentPrice: value,
                        totalAmount: parseFloat((value * amount).toFixed(2))
                    });
                }
                // increase total net worth by invested amount
                stocks.netWorthHistory.push({
                    date: today,
                    netWorth: parseFloat((stocks.netWorthHistory[stocks.netWorthHistory.length - 1].netWorth + (value * amount)).toFixed(2))
                });
                investedIndex = stocks.totalInvestedHistory.map(function (item) { return item.date; }).indexOf(today);
                if (investedIndex === -1) {
                    // if no purchase was made today
                    stocks.totalInvestedHistory.push({
                        date: today,
                        total: (stocks.totalInvestedHistory[stocks.totalInvestedHistory.length - 1].total + parseFloat((value * amount).toFixed(2)))
                    });
                }
                else {
                    // if purchase was made today, increment in existing date
                    stocks.totalInvestedHistory[investedIndex].total += parseFloat((value * amount).toFixed(2));
                }
                return [4 /*yield*/, stocks.save()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.addToExistingStock = addToExistingStock;
