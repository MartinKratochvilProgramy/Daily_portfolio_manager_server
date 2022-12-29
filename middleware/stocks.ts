import { Request, Response } from 'express';
import { getUserStocks } from "../utils/getUserStocks";
import { User } from '../models/user';
import { verifyToken } from '../utils/jwt';

export const stocks = async (req: Request, res: Response) => {
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
    const foundStocks = await getUserStocks(username);
    if (foundStocks) {
      res.json(foundStocks);

    } else {
      res.status(404);
      res.json({
        message: "Stocks not found",
      });

    }
  } catch (error) {
    console.log(error);
  }
};