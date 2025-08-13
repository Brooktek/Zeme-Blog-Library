// Placeholder for Stats Card component
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
