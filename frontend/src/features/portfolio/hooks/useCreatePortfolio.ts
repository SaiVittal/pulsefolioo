import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPortfolio, CreatePortfolioDto } from "../api/portfolioApi";

export function useCreatePortfolio() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePortfolioDto) => createPortfolio(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
}
