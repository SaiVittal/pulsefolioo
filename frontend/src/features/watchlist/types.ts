// src/features/watchlist/types.ts

export interface WatchlistItem {
    id: string;
    symbol: string;
    exchange: string;
}

export interface Watchlist {
    id: string;
    name: string;
    items: WatchlistItem[];
}

export interface CreateWatchlistDto {
    name: string;
}

export interface CreateWatchlistItemDto {
    symbol: string;
    exchange: string;
}
