import { Stocks } from '../models/stocks';
import { Response } from 'express';
import { PurchaseHistoryInterface, StockInterface } from '../types/stock';

export const stockRemove = async (
    username: string,
    ticker: string,
    newAmount: number,
    res: Response
) => {
    const stocks = await Stocks.findOne({ username: username }).exec();
    const currentAmount = stocks.stocks[stocks.stocks.findIndex((StockInterface: StockInterface) => StockInterface.ticker === ticker)].amount;

    if (!stocks) {
        res.status(403);
        res.json({
            message: "invalid access",
        });
        return;
    }

    let newStocks;
    if (newAmount === 0) {
        newStocks = stocks.stocks.filter((StockInterface: StockInterface) => StockInterface.ticker !== ticker);
    } else if (newAmount > 0) {
        newStocks = stocks.stocks;
        const objIndex = stocks.stocks.findIndex((stocks: StockInterface) => stocks.ticker === ticker);
        newStocks[objIndex].amount = newAmount;
    }

    let newPurchaseHistory;
    if (newAmount <= 0) {
        // if newAmount 0, remove stock all-together
        newPurchaseHistory = stocks.purchaseHistory.filter((purchase: PurchaseHistoryInterface) => purchase.ticker !== ticker);
    } else if (newAmount > 0) {
        const purchasesIndex = stocks.purchaseHistory.findIndex(((purchase: PurchaseHistoryInterface) => purchase.ticker === ticker));
        newPurchaseHistory = stocks.purchaseHistory[purchasesIndex].purchases;

        const target = currentAmount - newAmount;
        let count = 0;
        const result: string[] = [];

        for (let i = 0; i < newPurchaseHistory.length; i++) {
            const newPurchase = newPurchaseHistory[i];

            if (newPurchase.amount + count <= target) {
                count += newPurchase.amount;

            } else if (count < target && target < count + newPurchase.amount) {
                newPurchase.amount = newPurchase.amount - (target - count);
                result.push(newPurchase);
                count += (target - count);

            } else {
                result.push(newPurchase);

            }
        }

        stocks.purchaseHistory[purchasesIndex].purchases = result;
    }

    stocks.stocks = newStocks;

    await stocks.save();
}