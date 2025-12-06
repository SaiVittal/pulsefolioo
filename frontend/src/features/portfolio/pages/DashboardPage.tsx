import TransactionsTable from "../../../components/TransactionTable";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import { MetricCard } from "../../../components/ui/MetricCard";
import SectionCard from "../../../components/ui/SectionCard";

export default function DashboardPage() {
  return (
    <LayoutContainer>
      <MetricCard label="Total Value" value={105000} />
      <SectionCard title="Recent Transactions">
        <TransactionsTable mock />
      </SectionCard>
    </LayoutContainer>
  );
}
