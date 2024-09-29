import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Entry } from '.';

interface SummaryProps {
  transactions: Entry[];
  filter: string;
  className?: string;
}

const Card: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: string }> = ({
  title,
  amount,
  icon,
  color,
}) => (
  <div className={`p-4 sm:p-6 rounded-lg shadow-md ${color} transition-colors duration-300`}>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-lg font-semibold sm:text-xl'>{title}</h2>
      <div className='text-3xl'>{icon}</div>
    </div>
    <p className='text-2xl font-bold'>${amount.toLocaleString()}</p>
  </div>
);

const SummaryCards: React.FC<SummaryProps> = ({ transactions, filter, className }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={`grid max-w-5xl  grid-cols-1 gap-6 sm:grid-cols-2 ${className}`}>
      <Card
        title={`Total Income this ${filter}`}
        amount={totalIncome}
        icon={<ArrowUpCircle className='text-green-500' />}
        color='bg-white dark:bg-gray-900 text-gray-800 dark:text-white'
      />
      <Card
        title={`Total Expenses this ${filter}`}
        amount={totalExpenses}
        icon={<ArrowDownCircle className='text-red-500' />}
        color='bg-white dark:bg-gray-900 text-gray-800 dark:text-white'
      />
    </div>
  );
};

export default SummaryCards;
