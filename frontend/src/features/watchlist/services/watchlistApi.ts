import { apiGet, apiPost, apiDelete } from "../../../services/httpMethods";
import { Watchlist, CreateWatchlistDto, CreateWatchlistItemDto, WatchlistItem } from "../types";

export const getWatchlists = async (): Promise<Watchlist[]> => {
    return apiGet<Watchlist[]>("/watchlist/user");
};

export const createWatchlist = async (data: CreateWatchlistDto): Promise<Watchlist> => {
    return apiPost<Watchlist>("/watchlist", data);
};

export const deleteWatchlist = async (id: string): Promise<void> => {
    return apiDelete<void>(`/watchlist/${id}`);
};

export const addWatchlistItem = async (watchlistId: string, data: CreateWatchlistItemDto): Promise<WatchlistItem> => {
    return apiPost<WatchlistItem>(`/watchlist/${watchlistId}/items`, data);
};

export const removeWatchlistItem = async (watchlistId: string, itemId: string): Promise<void> => {
    return apiDelete<void>(`/watchlist/${watchlistId}/items/${itemId}`);
};
