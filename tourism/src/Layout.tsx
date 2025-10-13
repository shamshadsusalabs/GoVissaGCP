// src/components/Layout.tsx
import React from 'react';
import Navbar from './_pages/Navbar';
import Sidebar from './_pages/Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
