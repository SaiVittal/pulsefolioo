import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsByPortfolio } from "../api/transactionApi";

export function usePortfolioTransactions(portfolioId: string | null) {
  return useQuery({
    queryKey: ["transactions", portfolioId],
    queryFn: () => fetchTransactionsByPortfolio(portfolioId!),
    enabled: !!portfolioId,
  });
}
