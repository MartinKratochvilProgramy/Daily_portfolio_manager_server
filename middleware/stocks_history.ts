import { Request, Response } from 'express';
import { getCurrentDate } from "../utils/getCurrentDate";
import { User } from '../models/user';
import { Stocks } from '../models/stocks';
import { verifyToken } from '../utils/jwt';

interface StocksHistory {
  date: string;
  netWorth: number;
}

export default async function stocks_history(req: Request, res: Response) {
  // send stocks to client
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
    // auth user, if not found send back 403 err
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).exec();

    if (!user) {
      res.status(403);
      res.json({
        message: "Invalid access",
      });
      return;
    }
    const foundStocks = await Stocks.findOne({ username: username }).exec();
    if (foundStocks.netWorthHistory.length > 0) {
      // user has some history
      const stocks = foundStocks.netWorthHistory;
      const stocksHistory: StocksHistory[] = [];
      // strip _id propety from stocks
      for (let i = 0; i < stocks.length; i++) {
        stocksHistory.push({
          date: stocks[i].date,
          netWorth: stocks[i].netWorth
        })
      }

      res.json(stocksHistory);

    } else if (foundStocks.netWorthHistory.length === 0) {
      // user history is empty
      res.json([{
        date: getCurrentDate(),
        netWorth: 0,
      }])

    } else {

      res.status(404);
      res.json({
        message: "Stocks history not found",
      });
    }

  } catch (error) {
    console.log(error);

  }
};