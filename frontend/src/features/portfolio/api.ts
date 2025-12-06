import { apiGet } from "../../services/httpMethods";

export interface PortfolioResponse {
  id: string;
  name: string;
}

export const getMyPortfolios = () =>
  apiGet<PortfolioResponse[]>("/api/Portfolio/user");
