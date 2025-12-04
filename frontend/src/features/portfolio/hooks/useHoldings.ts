import { useQuery } from "@tanstack/react-query";
import { http } from "../../../services/http";

export interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

export function useHoldings() {
  return useQuery({
    queryKey: ["holdings"],
    queryFn: () => http<Holding[]>("/api/holding/my"),
  });
}
