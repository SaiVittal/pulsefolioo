import { apiGet, apiPost, apiDelete } from "../../../services/httpMethods";

export interface Portfolio {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
}

export interface Holding {
    id: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number; // fetched from market data
    value?: number;
    pnl?: number;
    pnlPct?: number;
}

export interface PortfolioSummary {
    totalValue: number;
    totalCost: number;
    totalPnl: number;
    dayPnl: number; // Mocked for now
    holdingsCount: number;
}

export const getPortfolios = async (): Promise<Portfolio[]> => {
    return apiGet<Portfolio[]>("/portfolio/user");
};

export const createPortfolio = async (name: string): Promise<Portfolio> => {
    return apiPost<Portfolio>("/portfolio", { name });
};

export const deletePortfolio = async (id: string): Promise<void> => {
    return apiDelete<void>(`/portfolio/${id}`);
};

export const getPortfolioHoldings = async (portfolioId: string): Promise<Holding[]> => {
    return apiGet<Holding[]>(`/holding/portfolio/${portfolioId}`);
};

export const getPortfolioSummary = async (portfolioId: string): Promise<PortfolioSummary> => {
    return apiGet<PortfolioSummary>(`/portfolio/${portfolioId}/summary`);
};

export interface TradeRequest {
    portfolioId: string;
    symbol: string;
    quantity: number;
    price: number;
    timestamp?: string;
}

export const buyStock = async (data: TradeRequest): Promise<any> => {
    return apiPost("/transactions/buy", data);
};

export const sellStock = async (data: TradeRequest): Promise<any> => {
    return apiPost("/transactions/sell", data);
};
