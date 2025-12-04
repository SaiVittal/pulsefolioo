import { usePortfolio } from "../hooks/usePortfolio";

export default function AnalyticsPage() {
  const { data, isLoading } = usePortfolio();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map((p) => (
        <div key={p.id}>{p.name} — {p.value}</div>
      ))}
    </div>
  );
}
