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
var getConversionRate_1 = require("../utils/getConversionRate");
var getUserStocks_1 = require("../utils/getUserStocks");
var stockAdd_1 = require("../utils/stockAdd");
var user_1 = require("../models/user");
var stocks_1 = require("../models/stocks");
var jwt_1 = require("../utils/jwt");
var fetch = require('node-fetch');
function stock_add(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var stockItems, ticker, amount, authorization, _a, auth, _b, username, token, decoded, user, stockInfo, stockInfoJson, conversionRate, value, stocks, _c, _d, _e, _f, error_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    stockItems = req.body.newStock;
                    ticker = stockItems.ticker.toUpperCase();
                    amount = stockItems.amount;
                    authorization = req.headers.authorization;
                    if (!authorization) {
                        res.json({
                            message: "Invalid header"
                        });
                        return [2 /*return*/];
                    }
                    _a = authorization.split(" "), auth = _a[1];
                    _b = auth.split(":"), username = _b[0], token = _b[1];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 13, , 14]);
                    decoded = (0, jwt_1.verifyToken)(token);
                    return [4 /*yield*/, user_1.User.findById(decoded.id).exec()];
                case 2:
                    user = _g.sent();
                    if (!user) {
                        res.status(403);
                        res.json({
                            message: "Invalid access"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("https://query1.finance.yahoo.com/v8/finance/chart/".concat(ticker))];
                case 3:
                    stockInfo = _g.sent();
                    return [4 /*yield*/, stockInfo.json()];
                case 4:
                    stockInfoJson = _g.sent();
                    if (!stockInfoJson.chart.result) {
                        res.status(403);
                        res.json({
                            message: "Ticker not found"
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, getConversionRate_1.getConversionRate)(stockInfoJson.chart.result[0].meta.currency, user.settings.currency)];
                case 5:
                    conversionRate = _g.sent();
                    value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2);
                    return [4 /*yield*/, stocks_1.Stocks.findOne({ username: username }).exec()];
                case 6:
                    stocks = _g.sent();
                    if (!!stocks) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, stockAdd_1.createNewStock)(username, ticker, amount, parseFloat(value))];
                case 7:
                    _g.sent();
                    _d = (_c = res).json;
                    return [4 /*yield*/, (0, getUserStocks_1.getUserStocks)(username)];
                case 8:
                    _d.apply(_c, [_g.sent()]);
                    return [2 /*return*/];
                case 9: return [4 /*yield*/, (0, stockAdd_1.addToExistingStock)(stocks, ticker, amount, parseFloat(value))];
                case 10:
                    _g.sent();
                    _f = (_e = res).json;
                    return [4 /*yield*/, (0, getUserStocks_1.getUserStocks)(username)];
                case 11:
                    _f.apply(_e, [_g.sent()]);
                    return [2 /*return*/];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_1 = _g.sent();
                    console.log(error_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = stock_add;
;
