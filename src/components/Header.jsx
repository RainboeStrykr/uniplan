import React from 'react';

export function Header({ title }) {
  return (
    <header className="sticky top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 py-4 border-b border-white/5">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-100 font-extrabold tracking-tight text-xl">UniPlan</h2>
        <span className="h-4 w-[1px] bg-white/10"></span>
        <nav className="flex gap-6">
          <span className="text-blue-400 font-semibold text-sm cursor-default">{title}</span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <span className="material-symbols-outlined text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <span className="material-symbols-outlined text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">help_outline</span>
        <img 
          alt="User Profile" 
          className="w-8 h-8 rounded-full border-2 border-blue-900" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcoNXF_4Og_PoqPKvoSUXqUOgZkySbHpYc2VPX6uSEhfr-RWCVe7_oEDim_pzMcBgEeeeLBB9NKwXwHYJrMj0MzzeT_eUiUKTVwZLC0XSsFRS9VRxYoWty2qOacbyTHSrZy6-A3-TuCwv0nzFVHMZqujHnTqquV_a42cgmg_tq2v79Xw0e5-PMiBZfKRP2hvpV3180aJFw_pAdCds30iYrgmXTBwXudjXfFHNvUMDm2oiz7o-QeGrhyObnUg82QSYfJoC9HTQuBSk"
        />
      </div>
    </header>
  );
}