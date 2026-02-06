import { apiGet } from "../../../services/httpMethods";

// Types matching backend DTOs
export interface MarketIndex {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface TrendingStock {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
}

export interface StockSearchResult {
    symbol: string;
    name: string;
}

export interface Quote {
    symbol: string;
    price: number;
    timestamp: string;
}

// API functions
export async function fetchMarketIndices(): Promise<MarketIndex[]> {
    return apiGet<MarketIndex[]>("/api/market/indices");
}

export async function fetchTrendingStocks(): Promise<TrendingStock[]> {
    return apiGet<TrendingStock[]>("/api/market/trending");
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
    if (!query.trim()) return [];
    return apiGet<StockSearchResult[]>(`/api/market/search?q=${encodeURIComponent(query)}`);
}

export async function fetchQuote(symbol: string): Promise<Quote> {
    return apiGet<Quote>(`/api/market/quote/${encodeURIComponent(symbol)}`);
}
