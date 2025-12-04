import SummaryCards from "../components/SummaryCards";
import HoldingsTable from "../components/HoldingsTable";
import ProfitChart from "../components/ProfitChart";
import PortfolioPie from "../components/PortfolioPie";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SummaryCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfitChart />
        <PortfolioPie />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Holdings</h2>
        <HoldingsTable />
      </div>
    </div>
  );
}
