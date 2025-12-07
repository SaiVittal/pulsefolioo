import { apiGet, apiPost } from "../../../services/httpMethods";

export interface CreateTransactionDto {
  portfolioId: string;
  holdingId?: string | null;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
}

export interface TransactionDto {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  price: number;
  side: "BUY" | "SELL";
  timestamp: string;
}

export async function createBuyTransaction(payload: CreateTransactionDto) {
  return apiPost<TransactionDto>("/api/Transactions/buy", payload);
}

export async function createSellTransaction(payload: CreateTransactionDto) {
  return apiPost<TransactionDto>("/api/Transactions/sell", payload);
}

export async function fetchTransactionsByPortfolio(
  portfolioId: string
): Promise<TransactionDto[]> {
  return apiGet<TransactionDto[]>(
    `/api/Transactions/portfolio/${portfolioId}`
  );
}
