import { useQuery } from "@tanstack/react-query";
import { getPortfolioSummary } from "../services/portfolioApi";

export function usePortfolioSummary(portfolioId: string | null) {
  return useQuery({
    queryKey: ["portfolio-summary", portfolioId],
    queryFn: () => getPortfolioSummary(portfolioId!),
    enabled: !!portfolioId,
  });
}
