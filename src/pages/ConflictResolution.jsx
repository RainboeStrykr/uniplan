import React from 'react';
import { Layout } from '../components/Layout';

export default function ConflictResolution() {
  return (
    <Layout title="Conflict Resolution Hub">
      

<div className="p-8 max-w-7xl mx-auto space-y-12">

<section className="flex flex-col md:flex-row gap-8 items-center bg-red-950/30 rounded-xl p-8 border-l-4 border-red-500">
<div className="flex-1 space-y-2">
<div className="flex items-center gap-2 text-red-400">
<span className="material-symbols-outlined font-bold" data-icon="error">error</span>
<h2 className="text-2xl font-black font-manrope">No Solution Found</h2>
</div>
<p className="text-slate-300 max-w-2xl font-medium leading-relaxed">
                        The engine reached a <span className="text-blue-300 font-bold underline decoration-blue-500/30 cursor-help" title="A state where a variable has no legal values remaining in its domain after applying consistency algorithms.">Dead-End State</span> after 4,208 iterations. The current constraints form an over-determined system that cannot be satisfied simultaneously.
                    </p>
</div>
<div className="flex gap-4">
<button className="px-6 py-3 bg-slate-800 text-slate-100 border border-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-700 transition-colors">
                        View Log
                    </button>
<button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-500 transition-all active:scale-95">
                        Start Manual Override
                    </button>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="lg:col-span-7 space-y-6">
<div className="flex justify-between items-end">
<div>
<h3 className="text-lg font-bold text-blue-200">Constraint Conflict Tree</h3>
<p className="text-xs text-slate-400">Trace the source of the backtracking failure</p>
</div>
<span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-400">Path: Root &gt; Faculty_Prefs &gt; Room_Availability</span>
</div>
<div className="space-y-4">

<div className="bg-slate-900 rounded-xl p-6 transition-all border-l-4 border-blue-500 shadow-xl">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</div>
<div>
<h4 className="font-bold text-slate-100">Prof. Eleanor Smith</h4>
<p className="text-xs text-slate-400">Constraint: No sessions after 4 PM</p>
</div>
</div>
<span className="px-2 py-1 bg-red-900/30 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider">Hard Conflict</span>
</div>
<div className="flex items-center gap-4 py-3 px-4 bg-slate-950/50 rounded-lg">
<span className="material-symbols-outlined text-slate-600" data-icon="link">link</span>
<div className="flex-1 h-[2px] bg-slate-800 relative">
<div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-[10px] font-bold text-slate-500">OVERLAP</div>
</div>
<span className="material-symbols-outlined text-slate-600" data-icon="meeting_room">meeting_room</span>
</div>
<div className="mt-4 flex justify-between items-center">
<div>
<h4 className="font-bold text-slate-100">Lecture Hall 101</h4>
<p className="text-xs text-slate-400">Constraint: Fully booked for Seminar Series</p>
</div>
<button className="text-blue-400 text-xs font-bold hover:underline">Modify Professor Prefs</button>
</div>
</div>

<div className="bg-slate-900 rounded-xl p-6 transition-all border-l-4 border-slate-600 shadow-xl">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400">
<span className="material-symbols-outlined" data-icon="groups">groups</span>
</div>
<div>
<h4 className="font-bold text-slate-100">CS-204 (Algorithms)</h4>
<p className="text-xs text-slate-400">Capacity Requirement: 120 Students</p>
</div>
</div>
<span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider">Soft Constraint</span>
</div>
<p className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-4 my-4">
                                "The domain of available rooms with capacity &gt; 120 is empty for the Wednesday 10:00 block."
                            </p>
<div className="flex justify-end">
<button className="text-blue-400 text-xs font-bold hover:underline">View Domain Analysis</button>
</div>
</div>
</div>
</div>

<div className="lg:col-span-5 space-y-6">
<div>
<h3 className="text-lg font-bold text-blue-200">Constraint Relaxation</h3>
<p className="text-xs text-slate-400">Heuristic suggestions to resolve the deadlock</p>
</div>
<div className="space-y-3">
<div className="group bg-slate-900 hover:bg-slate-800 p-4 rounded-xl transition-all cursor-pointer border border-slate-800">
<div className="flex items-start justify-between">
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-blue-400 shadow-sm">
<span className="material-symbols-outlined text-lg" data-icon="trending_up">trending_up</span>
</div>
<div>
<p className="text-sm font-bold text-slate-100">Increase room capacity tolerance</p>
<p className="text-xs text-slate-400">Allow 5% overflow (e.g. 105 in a 100-seat room)</p>
</div>
</div>
<span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 transition-colors" data-icon="add_circle">add_circle</span>
</div>
<div className="mt-3 overflow-hidden h-1.5 bg-slate-950 rounded-full">
<div className="h-full bg-blue-500/60 w-[85%]" title="Estimated Success Rate: 85%"></div>
</div>
</div>
<div className="group bg-slate-900 hover:bg-slate-800 p-4 rounded-xl transition-all cursor-pointer border border-slate-800">
<div className="flex items-start justify-between">
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-blue-400 shadow-sm">
<span className="material-symbols-outlined text-lg" data-icon="schedule">schedule</span>
</div>
<div>
<p className="text-sm font-bold text-slate-100">Extend standard session hours</p>
<p className="text-xs text-slate-400">Allow 6 PM - 8 PM sessions for elective courses</p>
</div>
</div>
<span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 transition-colors" data-icon="add_circle">add_circle</span>
</div>
</div>
<div className="group bg-slate-900 hover:bg-slate-800 p-4 rounded-xl transition-all cursor-pointer border border-slate-800">
<div className="flex items-start justify-between">
<div className="flex gap-4">
<div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-blue-400 shadow-sm">
<span className="material-symbols-outlined text-lg" data-icon="swap_horiz">swap_horiz</span>
</div>
<div>
<p className="text-sm font-bold text-slate-100">Convert to Hybrid mode</p>
<p className="text-xs text-slate-400">Switch 'Intro to Philosophy' to online-only for Semester 1</p>
</div>
</div>
<span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 transition-colors" data-icon="add_circle">add_circle</span>
</div>
</div>
</div>

<div className="p-6 bg-blue-900/40 border border-blue-500/20 text-blue-100 rounded-2xl relative overflow-hidden group shadow-2xl">
<div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
<span className="material-symbols-outlined text-9xl" data-icon="auto_awesome">auto_awesome</span>
</div>
<h4 className="font-manrope font-extrabold text-blue-300 mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="lightbulb">lightbulb</span>
                            Engine Insight
                        </h4>
<p className="text-sm text-blue-100/80 font-medium leading-relaxed relative z-10">
                            You are seeing an <span className="underline decoration-blue-500/50 text-blue-300">Arc Consistency Failure</span>. This means that for at least one pair of variables, no consistent values remain. Consider converting some <span className="italic font-bold text-blue-200">Hard Constraints</span> to <span className="italic font-bold text-blue-200">Soft Constraints</span> with penalty weights to allow the solver to progress.
                        </p>
</div>
</div>
</div>

<section className="space-y-6 pt-8 border-t border-slate-800">
<div className="flex items-center justify-between">
<div>
<h3 className="text-xl font-black text-slate-100 font-manrope">Partial Assignments (Draft)</h3>
<p className="text-sm text-slate-400">Force specific values to see how the system reacts</p>
</div>
<div className="flex gap-2">
<button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-200 uppercase tracking-widest transition-colors">Clear All</button>
<button className="px-4 py-2 bg-slate-800 text-slate-100 border border-slate-700 rounded-lg font-bold text-xs hover:bg-slate-700 transition-colors">Run Partial Solve</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col gap-3">
<div className="flex justify-between items-center">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Variable</span>
<span className="material-symbols-outlined text-blue-400 text-sm" data-icon="push_pin">push_pin</span>
</div>
<h5 className="font-bold text-blue-200">CS-101: Intro to Computing</h5>
<select className="w-full bg-slate-950 border border-slate-800 rounded-lg text-sm py-2 text-slate-300 focus:ring-blue-500/50">
<option>Assigned: Mon 09:00 (Hall A)</option>
<option>Force: Tue 14:00 (Lab 2)</option>
<option>Force: Wed 11:00 (Hall B)</option>
</select>
</div>

<div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
<div className="flex justify-between items-center">
<span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Variable</span>
<span className="material-symbols-outlined text-slate-600 text-sm" data-icon="lock_open">lock_open</span>
</div>
<h5 className="font-bold text-blue-200">MAT-302: Calculus III</h5>
<div className="flex items-center justify-center h-10 border-2 border-dashed border-slate-800 rounded-lg text-xs font-bold text-slate-500">
                            Click to assign manually
                        </div>
</div>

<button className="border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-900 hover:border-slate-700 transition-all py-8 group">
<span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 transition-colors" data-icon="add">add</span>
<span className="text-xs font-bold text-slate-500 group-hover:text-slate-300">Pin Variable</span>
</button>
</div>
</section>
</div>

    </Layout>
  );
}
