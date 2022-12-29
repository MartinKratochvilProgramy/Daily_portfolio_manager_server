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
exports.stockRemove = void 0;
var stocks_1 = require("../models/stocks");
var stockRemove = function (username, ticker, newAmount, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stocks, currentAmount, newStocks, objIndex, newPurchaseHistory, purchasesIndex, amtToRemove, count, result, i, newPurchase;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stocks_1.Stocks.findOne({ username: username }).exec()];
            case 1:
                stocks = _a.sent();
                currentAmount = stocks.stocks[stocks.stocks.findIndex(function (StockInterface) { return StockInterface.ticker === ticker; })].amount;
                if (!stocks) {
                    res.status(403);
                    res.json({
                        message: "invalid access"
                    });
                    return [2 /*return*/];
                }
                if (newAmount === 0) {
                    newStocks = stocks.stocks.filter(function (StockInterface) { return StockInterface.ticker !== ticker; });
                }
                else if (newAmount > 0) {
                    newStocks = stocks.stocks;
                    objIndex = stocks.stocks.findIndex(function (stocks) { return stocks.ticker === ticker; });
                    newStocks[objIndex].amount = newAmount;
                }
                if (newAmount <= 0) {
                    // if newAmount 0, remove stock all-together
                    newPurchaseHistory = stocks.purchaseHistory.filter(function (purchase) { return purchase.ticker !== ticker; });
                }
                else if (newAmount > 0) {
                    purchasesIndex = stocks.purchaseHistory.findIndex((function (purchase) { return purchase.ticker === ticker; }));
                    newPurchaseHistory = stocks.purchaseHistory[purchasesIndex].purchases;
                    amtToRemove = currentAmount - newAmount;
                    count = 0;
                    result = [];
                    // unless the count is higher than amtToRemove, ignore purchases
                    for (i = 0; i < newPurchaseHistory.length; i++) {
                        newPurchase = newPurchaseHistory[i];
                        if (newPurchase.amount + count <= amtToRemove) {
                            count += newPurchase.amount;
                        }
                        else if (count < amtToRemove && amtToRemove < count + newPurchase.amount) {
                            newPurchase.amount = newPurchase.amount - (amtToRemove - count);
                            result.push(newPurchase);
                            count += (amtToRemove - count);
                        }
                        else {
                            result.push(newPurchase);
                        }
                    }
                    stocks.purchaseHistory[purchasesIndex].purchases = result;
                }
                stocks.stocks = newStocks;
                return [4 /*yield*/, stocks.save()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.stockRemove = stockRemove;
