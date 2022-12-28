interface Purchase {
    date: string,
    amount: number,
    currentPrice: number,
    totalAmount: number
}

export interface FormattedStock {
    ticker: string;
    amount: number;
    prevClose: number;
    _id: string;
    firstPurchase: string;
    lastPurchase: string;
    purchaseHistory: Purchase[];
}

export interface Stock {
    ticker: string;
    amount: number;
    prevClose: number;
}

export interface PurchaseHistory {
    ticker: string;
    purchases: Purchase[];
}

export interface TotalInvestedHistory {
    date: string;
    total: number;
}

export interface Stocks {
    username: string;
    stocks: Stock[];
    purchaseHistory: PurchaseHistory[];
    netWorthHistory: {
        date: string;
        netWorth: number;
    }[];
    relativeChangeHistory: {
        date: string;
        relativeChange: number;
    }[];
    totalInvestedHistory: TotalInvestedHistory[];

}