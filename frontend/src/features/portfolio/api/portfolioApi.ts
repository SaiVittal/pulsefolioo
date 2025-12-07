import { apiGet, apiPost, apiDelete } from "../../../services/httpMethods";

export interface PortfolioDto {
  id: string;
  name: string;
}

export interface CreatePortfolioDto {
  name: string;
}

export interface PortfolioSummaryDto {
  totalValue: number;
  totalPnl: number;
  dailyChangePct: number;
  holdingsCount: number;
}

export async function fetchUserPortfolios(): Promise<PortfolioDto[]> {
  return apiGet<PortfolioDto[]>("/api/Portfolio/user");
}

export async function createPortfolio(payload: CreatePortfolioDto) {
  return apiPost<PortfolioDto>("/api/Portfolio", payload);
}

export async function fetchPortfolioSummary(
  portfolioId: string
): Promise<PortfolioSummaryDto> {
  return apiGet<PortfolioSummaryDto>(`/api/Portfolio/${portfolioId}/summary`);
}

export async function deletePortfolio(portfolioId: string) {
  return apiDelete<void>(`/api/Portfolio/${portfolioId}`);
}
