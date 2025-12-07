import { apiGet } from "../../../services/httpMethods";

export interface HoldingDto {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
}

export async function fetchHoldingsByPortfolio(
  portfolioId: string
): Promise<HoldingDto[]> {
  return apiGet<HoldingDto[]>(`/api/Holding/portfolio/${portfolioId}`);
}
