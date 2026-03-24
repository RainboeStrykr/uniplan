import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/inputs', icon: 'edit_note', label: 'Inputs' },
  { path: '/visualiser', icon: 'account_tree', label: 'Visualiser' },
  { path: '/results', icon: 'fact_check', label: 'Results' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 flex flex-col bg-slate-950 border-r border-white/5 font-inter text-sm font-medium">
      <div className="flex flex-col p-6 h-full">
        <div className="mb-8">
          <h1 className="font-manrope font-black text-blue-400 text-xl tracking-tight">UniPlan</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">V1.0 AI Engine</p>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/inputs'); // Default logic
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                  isActive 
                    ? 'bg-blue-950/40 text-blue-300 shadow-sm font-bold border border-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 transition-colors shadow-lg shadow-blue-900/20">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate Schedule
          </button>
          <a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-400 transition-colors" href="#">
            <span className="material-symbols-outlined">menu_book</span>
            <span>Documentation</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-400 transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
