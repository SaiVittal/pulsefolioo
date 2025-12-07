import { useQuery } from "@tanstack/react-query";
import { fetchHoldingsByPortfolio } from "../api/holdingApi";

export function useHoldings(portfolioId: string | null) {
  return useQuery({
    queryKey: ["holdings", portfolioId],
    queryFn: () => fetchHoldingsByPortfolio(portfolioId!),
    enabled: !!portfolioId,
  });
}
