import { useQuery } from "@tanstack/react-query";
import { fetchTop10Positions } from "../api/analyticsApi";

export function useTop10Analytics() {
  return useQuery({
    queryKey: ["analytics", "top10"],
    queryFn: fetchTop10Positions,
  });
}
