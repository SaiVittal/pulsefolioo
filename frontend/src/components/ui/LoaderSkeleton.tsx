import { Skeleton } from "antd";

export function LoaderSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Skeleton active paragraph={{ rows: 3 }} />
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  );
}
