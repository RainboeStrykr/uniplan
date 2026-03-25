import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/inputs', icon: 'edit_note', label: 'Inputs' },
  { path: '/visualiser', icon: 'account_tree', label: 'Visualiser' },
  { path: '/results', icon: 'fact_check', label: 'Results' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/docs', icon: 'menu_book', label: 'Documentation' },
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
        </div>
      </div>
    </aside>
  );
}
