import { Request, Response } from 'express';
import { getUserStocks } from "../utils/getUserStocks";
import { stockRemove } from "../utils/stockRemove";
import { updateStocks } from "../utils/updateStocks";
const User = require("../models/user");
const { verifyToken } = require("../utils/jwt");

export const stock_remove = async (req: Request, res: Response) => {
  // remove stock from db
  const { authorization } = req.headers;

  if (!authorization) {
    res.json({
      message: "Invalid header"
    })
    return;
  }

  const ticker = req.body.ticker;
  const newAmount = req.body.amount;

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
        message: "invalid access",
      });
      return;
    }

    stockRemove(username, ticker, newAmount, res);
    await updateStocks(username);

    const userStocks = await getUserStocks(username);
    res.json(userStocks);

  } catch (error) {
    console.log(error);

  }
};