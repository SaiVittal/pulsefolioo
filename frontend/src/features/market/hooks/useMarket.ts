import { useQuery } from "@tanstack/react-query";
import {
    fetchMarketIndices,
    fetchTrendingStocks,
    searchStocks,
    fetchQuote,
    MarketIndex,
    TrendingStock,
    StockSearchResult,
    Quote,
} from "../api/marketApi";

// Query keys for caching
export const marketKeys = {
    all: ["market"] as const,
    indices: () => [...marketKeys.all, "indices"] as const,
    trending: () => [...marketKeys.all, "trending"] as const,
    search: (query: string) => [...marketKeys.all, "search", query] as const,
    quote: (symbol: string) => [...marketKeys.all, "quote", symbol] as const,
};

export function useMarketIndices() {
    return useQuery<MarketIndex[], Error>({
        queryKey: marketKeys.indices(),
        queryFn: fetchMarketIndices,
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // Auto-refresh every minute
    });
}

export function useTrendingStocks() {
    return useQuery<TrendingStock[], Error>({
        queryKey: marketKeys.trending(),
        queryFn: fetchTrendingStocks,
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useStockSearch(query: string) {
    return useQuery<StockSearchResult[], Error>({
        queryKey: marketKeys.search(query),
        queryFn: () => searchStocks(query),
        enabled: query.length >= 1,
        staleTime: 5 * 60 * 1000, // 5 minutes for search results
    });
}

export function useQuote(symbol: string) {
    return useQuery<Quote, Error>({
        queryKey: marketKeys.quote(symbol),
        queryFn: () => fetchQuote(symbol),
        enabled: !!symbol,
        staleTime: 30 * 1000, // 30 seconds
    });
}
