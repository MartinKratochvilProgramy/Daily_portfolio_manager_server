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
exports.update = void 0;
var getCurrentDate_1 = require("../utils/getCurrentDate");
var updateStocks_1 = require("../utils/updateStocks");
var updateRelativeChange_1 = require("../utils/updateRelativeChange");
var stocks_1 = require("../models/stocks");
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, output, today, allUsers, i, stocksoutput, relativeChangeoutput, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = req.headers.password;
                if (password !== process.env.SECRET) {
                    res.status(403);
                    res.json({
                        message: "Failed, wrong credentials"
                    });
                    return [2 /*return*/];
                }
                output = [];
                today = new Date();
                output.push("Updating stock info at day ".concat((0, getCurrentDate_1.getCurrentDate)()));
                if (!(today.getDay() !== 6 && today.getDay() !== 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, stocks_1.Stocks.find()];
            case 1:
                allUsers = _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < allUsers.length)) return [3 /*break*/, 8];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, (0, updateStocks_1.updateStocks)(allUsers[i].username)];
            case 4:
                stocksoutput = _a.sent();
                output.push(stocksoutput);
                return [4 /*yield*/, (0, updateRelativeChange_1.updateRelativeChange)(allUsers[i].username)];
            case 5:
                relativeChangeoutput = _a.sent();
                output.push(relativeChangeoutput);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                output.push("ERROR: ".concat(error_1, " USER: ").concat(allUsers[i].username));
                return [3 /*break*/, 7];
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8:
                output.push("-------------------");
                _a.label = 9;
            case 9:
                res.json({
                    message: "Success",
                    output: output
                });
                return [2 /*return*/];
        }
    });
}); };
exports.update = update;
