import LayoutContainer from "../../../components/ui/LayoutContainer";
import PageTransition from "../../../components/ui/PageTransition";
import { Typography } from "antd";
import { useTop10Analytics } from "../hooks/useAnalytics";

export default function AnalyticsPage() {
  const { data, isLoading } = useTop10Analytics();

  return (
    <PageTransition>
      <LayoutContainer>
        <Typography.Title level={3}>Analytics</Typography.Title>
        <Typography.Paragraph type="secondary">
          Top 10 positions by P&L.
        </Typography.Paragraph>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </LayoutContainer>
    </PageTransition>
  );
}
