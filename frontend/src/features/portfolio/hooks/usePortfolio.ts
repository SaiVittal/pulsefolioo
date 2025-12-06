import { getMyPortfolios, } from './../api';
import { useQuery } from "@tanstack/react-query";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: getMyPortfolios,
  });
}
