// src/components/TransactionsTable.tsx

import { Table, Tag, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';

// Mock data structure
interface Transaction {
  key: string;
  asset: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  date: string;
}

const mockTransactions: Transaction[] = [
  { key: '1', asset: 'AAPL', type: 'BUY', amount: 10, price: 150.25, date: '2025-11-01' },
  { key: '2', asset: 'MSFT', type: 'SELL', amount: 5, price: 320.50, date: '2025-11-03' },
  { key: '3', asset: 'GOOGL', type: 'BUY', amount: 3, price: 2800.00, date: '2025-11-05' },
];

// Mock API call simulation
const fetchTransactions = (): Promise<Transaction[]> => new Promise(resolve => {
  setTimeout(() => resolve(mockTransactions), 1500); // Simulate network delay
});


export default function TransactionsTable({ mock }: { mock?: boolean }) {
  // Use tanstack/react-query to handle fetching and loading state
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    enabled: !mock // Only fetch if 'mock' prop is not passed (for a real app)
  });
  
  const finalData = mock ? mockTransactions : transactions;

  const columns = [
    { title: 'Asset', dataIndex: 'asset', key: 'asset' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: 'BUY' | 'SELL') => (
        <Tag color={type === 'BUY' ? 'success' : 'error'}>{type}</Tag>
      ),
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `$${price.toFixed(2)}` },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  if (isLoading) {
    // Show a smaller skeleton while the data is loading/fetching
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  return (
    <Table 
      dataSource={finalData} 
      columns={columns} 
      pagination={{ pageSize: 5 }} 
      size="small"
    />
  );
}