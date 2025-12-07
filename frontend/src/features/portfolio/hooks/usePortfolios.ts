import { fetchUserPortfolios } from '../api/portfolioApi';
import { useQuery } from "@tanstack/react-query";

export function usePortfolios() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: fetchUserPortfolios,
  });
}
