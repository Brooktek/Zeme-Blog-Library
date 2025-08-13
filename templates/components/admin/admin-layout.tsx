import React from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Posts', href: '/admin/posts' },
  { name: 'New Post', href: '/admin/posts/new' },
  { name: 'Categories', href: '/admin/categories' },
  { name: 'Tags', href: '/admin/tags' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="block px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
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
