'use client';

import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/stats-card';

interface AdminStats {
  posts: number;
  categories: number;
  tags: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data: AdminStats = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading stats...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Posts" value={stats?.posts ?? 0} />
        <StatsCard title="Total Categories" value={stats?.categories ?? 0} />
        <StatsCard title="Total Tags" value={stats?.tags ?? 0} />
      </div>
    </div>
  );
}

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
