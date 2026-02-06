import { useQuery } from "@tanstack/react-query";
import { getPortfolioHoldings } from "../services/portfolioApi";

export function useHoldings(portfolioId: string | null) {
  return useQuery({
    queryKey: ["holdings", portfolioId],
    queryFn: () => getPortfolioHoldings(portfolioId!),
    enabled: !!portfolioId,
  });
}
