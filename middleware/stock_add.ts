import { Request, Response } from 'express';
import { getConversionRate } from "../utils/getConversionRate";
import { getUserStocks } from "../utils/getUserStocks";
import { createNewStock, addToExistingStock } from "../utils/stockAdd";
import { User } from '../models/user';
import { Stocks } from '../models/stocks';
import { verifyToken } from '../utils/jwt';
const fetch = require('node-fetch');

export default async function stock_add(req: Request, res: Response) {
  // add stock to db
  const stockItems = req.body.newStock;   // new stock object
  const ticker = stockItems.ticker.toUpperCase();
  const amount = stockItems.amount;

  const { authorization } = req.headers;

  if (!authorization) {
    res.json({
      message: "Invalid header"
    })
    return;
  }

  // get username password from headers
  const [, auth] = authorization.split(" ");
  const [username, token] = auth.split(":");

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).exec();

    if (!user) {
      res.status(403);
      res.json({
        message: "Invalid access",
      });
      return;
    }

    // get stocks ticker, if not exists, return
    const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`)
    const stockInfoJson = await stockInfo.json()
    if (!stockInfoJson.chart.result) {
      res.status(403);
      res.json({
        message: "Ticker not found",
      });
      return;
    }

    // current price of stock in set currency
    const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, user.settings.currency);
    const value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2);
    const stocks = await Stocks.findOne({ username: username }).exec();

    if (!stocks) {
      await createNewStock(username, ticker, amount, parseFloat(value));

      res.json(await getUserStocks(username));
      return;

    } else {
      await addToExistingStock(stocks, ticker, amount, parseFloat(value));

      res.json(await getUserStocks(username));
      return;
    }
  } catch (error) {
    console.log(error);
  }
};