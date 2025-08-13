// Placeholder for Admin page
import React from 'react';
import StatsCard from '@/components/admin/stats-card';

const AdminPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <StatsCard title="Total Posts" value={0} />
        <StatsCard title="Total Categories" value={0} />
        <StatsCard title="Total Tags" value={0} />
      </div>
    </div>
  );
};

export default AdminPage;
