import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';

export default function PerformanceAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/performance/comparison')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const current = data?.current;
  const alternatives = data?.alternatives || [];
  
  const mrvAlt = alternatives.find(a => a.heuristic_used === 'mrv') || {};
  const noneAlt = alternatives.find(a => a.heuristic_used === 'none') || {};

  return (
    <Layout title="Performance Analytics Hub">
      <section className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full mt-[60px] h-[calc(100vh-60px)] overflow-y-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 inline-block border border-slate-700">Algorithm Alpha</span>
                <h3 className="text-xl font-extrabold text-blue-50">Vanilla Backtracking</h3>
                <p className="text-sm text-slate-400 mt-1">Standard recursive search without heuristics.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-manrope font-black text-slate-100">{noneAlt.time_taken_ms ? (noneAlt.time_taken_ms/1000).toFixed(2) : '0'}<span className="text-sm font-normal text-slate-500">s</span></span>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Avg. Execution</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400">Search Breadth</span>
                <span className="text-xs font-mono text-slate-500">{noneAlt.nodes_expanded || 0} Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 w-[100%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-blue-900/50 rounded-xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-900/30 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2 inline-block border border-blue-800/50">Algorithm Beta (Active)</span>
                <h3 className="text-xl font-extrabold text-blue-50">Backtracking + MRV/MCV/LCV</h3>
                <p className="text-sm text-slate-400 mt-1">Minimum Remaining Values with forward checking.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-manrope font-black text-blue-400">{current?.time_taken_ms ? (current.time_taken_ms/1000).toFixed(2) : '0'}<span className="text-sm font-normal text-slate-500">s</span></span>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Avg. Execution</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400">Search Breadth</span>
                <span className="text-xs font-mono text-slate-500">{current?.nodes_expanded || 0} Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[15%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-lg font-bold text-blue-50">Granular Metric Comparison</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm Architecture</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nodes Expanded</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Backtracks</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                      <span className="text-sm font-semibold text-slate-200">Vanilla Backtracking</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">{noneAlt.nodes_expanded || 0}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">{noneAlt.backtrack_count || 0}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">{noneAlt.time_taken_ms?.toFixed(2) || 0}</td>
                </tr>
                <tr className="bg-blue-900/10 hover:bg-blue-900/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-semibold text-blue-50">Backtracking + MRV/LCV</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono font-bold text-blue-400">{current?.nodes_expanded || 0}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">{current?.backtrack_count || 0}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">{current?.time_taken_ms?.toFixed(2) || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
}
