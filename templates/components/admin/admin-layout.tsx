// Placeholder for Admin Layout component
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <h2 className="text-xl font-bold p-4">Admin Menu</h2>
        {/* Navigation links here */}
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
