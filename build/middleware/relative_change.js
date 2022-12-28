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
exports.relative_change = void 0;
var getCurrentDate_1 = require("../utils/getCurrentDate");
var User = require("../models/user");
var Stocks = require("../models/stocks");
var verifyToken = require("../utils/jwt").verifyToken;
var relative_change = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, _a, auth, _b, username, token, decoded, user, foundInvestments, relativeChangeHistory, formattedRelativeChangeHistory, i, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                authorization = req.headers.authorization;
                if (!authorization) {
                    res.json({
                        message: "Invalid header"
                    });
                    return [2 /*return*/];
                }
                _a = authorization.split(" "), auth = _a[1];
                _b = auth.split(":"), username = _b[0], token = _b[1];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                decoded = verifyToken(token);
                return [4 /*yield*/, User.findById(decoded.id).exec()];
            case 2:
                user = _c.sent();
                if (!user) {
                    res.status(403);
                    res.json({
                        message: "Invalid access"
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Stocks.findOne({ username: username }).exec()];
            case 3:
                foundInvestments = _c.sent();
                if (foundInvestments.relativeChangeHistory.length > 0) {
                    relativeChangeHistory = foundInvestments.relativeChangeHistory;
                    formattedRelativeChangeHistory = [];
                    // strip _id propety from stocks
                    for (i = 0; i < relativeChangeHistory.length; i++) {
                        formattedRelativeChangeHistory.push({
                            date: relativeChangeHistory[i].date,
                            relativeChange: relativeChangeHistory[i].relativeChange
                        });
                    }
                    res.json(formattedRelativeChangeHistory);
                }
                else if (foundInvestments.relativeChangeHistory.length === 0) {
                    // user history is empty
                    res.json([{
                            date: (0, getCurrentDate_1.getCurrentDate)(),
                            relativeChange: 1
                        }]);
                }
                else {
                    res.status(404);
                    res.json({
                        message: "Relative change not found"
                    });
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.relative_change = relative_change;
