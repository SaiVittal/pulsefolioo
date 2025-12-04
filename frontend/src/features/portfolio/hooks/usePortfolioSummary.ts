import { useQuery } from "@tanstack/react-query";
import { http } from "../../../services/http";

export interface PortfolioSummary {
  totalValue: number;
  invested: number;
  totalPnL: number;
  todaysPnL: number;
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: ["portfolio-summary"],
    queryFn: () =>
      http<PortfolioSummary>("/api/portfolio/my/summary"),
  });
}
