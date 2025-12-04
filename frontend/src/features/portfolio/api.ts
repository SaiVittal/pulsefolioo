import { apiGet } from "../../services/httpMethods";

export interface PortfolioResponse {
  id: number;
  name: string;
  value: number;
}

export const getPortfolio = () =>
  apiGet<PortfolioResponse[]>("/portfolio");
