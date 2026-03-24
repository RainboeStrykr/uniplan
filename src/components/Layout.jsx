import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Header title={title} />
        {children}
      </main>
    </div>
  );
}
