import { Request, Response } from 'express';
import { User } from '../models/user';
import { verifyToken } from '../utils/jwt';
import getTickerChartData from '../utils/getTickerChartData';

export default async function ticker_chart(req: Request, res: Response) {
    // send stocks to client
    const { authorization } = req.headers;
    const { period, ticker } = req.body;

    
    if (!authorization) {
        res.json({
            message: "Invalid header"
        })
        return;
    }
    
    // get username password from headers
    const [, auth] = authorization.split(" ");
    const [, token] = auth.split(":");
    
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
        
        const data = await getTickerChartData(ticker, period);
        
        res.json(data);

    } catch (error) {
        console.log(error);

    }
};