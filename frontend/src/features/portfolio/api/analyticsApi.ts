import { apiGet } from "../../../services/httpMethods";

export interface TopPositionDto {
  symbol: string;
  pnl: number;
  value: number;
}

export async function fetchTop10Positions(): Promise<TopPositionDto[]> {
  return apiGet<TopPositionDto[]>("/api/Analytics/top10");
}
