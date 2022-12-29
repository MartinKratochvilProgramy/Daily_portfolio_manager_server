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
exports.updateStocks = void 0;
var getCurrentDate_1 = require("../utils/getCurrentDate");
var stocks_1 = require("../models/stocks");
var user_1 = require("../models/user");
var fetch = require('node-fetch');
var updateStocks = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var stocks, user, totalNetWorth, i, stockInfo, stockInfoJson, conversionRate, conversionRateSrc, conversionRateJson, prevClose, today, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stocks_1.Stocks.findOne({ username: username }).exec()];
            case 1:
                stocks = _a.sent();
                return [4 /*yield*/, user_1.User.findOne({ username: username }).exec()];
            case 2:
                user = _a.sent();
                totalNetWorth = 0;
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < stocks.stocks.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, fetch("https://query1.finance.yahoo.com/v8/finance/chart/".concat(stocks.stocks[i].ticker))];
            case 4:
                stockInfo = _a.sent();
                return [4 /*yield*/, stockInfo.json()
                    // get conversion rate from set currency -> user currency
                    // if stock currency === user settings currency, conversion is 1
                ];
            case 5:
                stockInfoJson = _a.sent();
                conversionRate = void 0;
                if (!(stockInfoJson.chart.result[0].meta.currency === user.settings.currency)) return [3 /*break*/, 6];
                conversionRate = 1;
                return [3 /*break*/, 9];
            case 6: return [4 /*yield*/, fetch("https://query1.finance.yahoo.com/v8/finance/chart/".concat(stockInfoJson.chart.result[0].meta.currency).concat(user.settings.currency, "=X"))];
            case 7:
                conversionRateSrc = _a.sent();
                return [4 /*yield*/, conversionRateSrc.json()];
            case 8:
                conversionRateJson = _a.sent();
                conversionRate = conversionRateJson.chart.result[0].meta.previousClose;
                _a.label = 9;
            case 9:
                prevClose = (stockInfoJson.chart.result[0].meta.previousClose * conversionRate).toFixed(2);
                stocks.stocks[i].prevClose = prevClose;
                totalNetWorth += parseFloat(prevClose) * stocks.stocks[i].amount;
                _a.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 3];
            case 11:
                today = (0, getCurrentDate_1.getCurrentDate)();
                stocks.netWorthHistory.push({
                    date: today,
                    netWorth: parseFloat((totalNetWorth).toFixed(2))
                });
                return [4 /*yield*/, stocks.save()];
            case 12:
                _a.sent();
                console.log("updating stocks for user " + username);
                response = "updating stocks for user " + username;
                return [2 /*return*/, response];
        }
    });
}); };
exports.updateStocks = updateStocks;
