import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  // Optional: Add an icon component or other visual elements
  // icon?: React.ReactNode;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
import React from 'react';

const StatsCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
