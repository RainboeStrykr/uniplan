import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';

export default function TimetableOutput() {
  const [timetable, setTimetable] = useState([]);
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    fetchTimetable();
    fetchMetrics();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/timetable/');
      const data = await res.json();
      setTimetable(data.timetable || []);
    } catch {}
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/performance/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch {}
  };

  // Map backend days to columns
  const dayColMap = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5
  };

  // Map backend time to rows (assumes 08:00 is row 1, 09:00 is row 2, etc.)
  const getRowStart = (timeStr) => {
    if (!timeStr) return 1;
    const hour = parseInt(timeStr.split(':')[0], 10);
    return Math.max(1, hour - 7); // 08:00 = 1
  };
  
  const getRowSpan = (duration) => {
      // Assuming duration is in hours
      return Math.round(duration);
  };

  const qualityScore = metrics && metrics.nodes_expanded > 0 ? 100 : 0;

  return (
    <Layout title="Timetable Output Hub">
      <div className="p-8 space-y-8 max-w-[1600px] h-[calc(100vh-60px)] overflow-y-auto mt-[60px]">
        
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-manrope font-extrabold text-white tracking-tight">Timetable Output</h2>
            <p className="text-slate-400 font-body">Viewing latest generated optimal schedule.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-all">
              <span className="material-symbols-outlined text-[18px]">file_download</span> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="text-sm font-bold text-slate-400">Master Schedule Grid</div>
              </div>
              
              <div className="relative grid grid-cols-[80px_repeat(5,1fr)] overflow-x-auto min-w-[700px]">
                <div className="h-12 bg-slate-900 border-b border-slate-800"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                   <div key={d} className="h-12 bg-slate-900 flex items-center justify-center border-l border-slate-800 border-b border-slate-800 font-manrope font-bold text-xs uppercase tracking-widest text-slate-500">{d}</div>
                ))}

                <div className="col-span-6 grid grid-cols-[80px_repeat(5,1fr)] h-[600px] relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-rows-[repeat(11,1fr)]">
                    {[...Array(11)].map((_, i) => <div key={i} className="border-b border-slate-800/50"></div>)}
                  </div>
                  <div className="absolute inset-0 grid grid-cols-[80px_repeat(5,1fr)]">
                    <div className="border-r border-slate-800/50"></div>
                    {[...Array(5)].map((_, i) => <div key={i} className="border-r border-slate-800/50"></div>)}
                  </div>

                  {/* Time Labels */}
                  <div className="col-start-1 grid grid-rows-[repeat(11,1fr)] py-2">
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                       <span key={t} className="text-[10px] font-bold text-slate-500 flex items-start justify-center pr-2">{t}</span>
                    ))}
                  </div>

                  {/* Render Timetable Blocks */}
                  {(() => {
                      // Pre-process overlaps to split column widths for simultaneous classes
                      const timeGroups = {};
                      timetable.forEach(item => {
                          const key = `${item.time_slot?.day}-${item.time_slot?.start_time}`;
                          if (!timeGroups[key]) timeGroups[key] = [];
                          timeGroups[key].push(item);
                      });

                      return timetable.map((item, idx) => {
                         const key = `${item.time_slot?.day}-${item.time_slot?.start_time}`;
                         const group = timeGroups[key];
                         const overlapCount = group.length;
                         const overlapIndex = group.findIndex(g => g.session_id === item.session_id);

                         const col = dayColMap[item.time_slot?.day] || 1;
                         const rowStart = getRowStart(item.time_slot?.start_time);
                         const span = getRowSpan(item.course?.duration || 1);
                         
                         // Calculate top and height percentages based on 11 rows (11 hours)
                         const topPercent = ((rowStart - 1) / 10) * 100;
                         const heightPercent = (span / 10) * 100;
                         
                         // Cycle distinct colors
                         const colors = [
                             'bg-blue-500/10 border-blue-500 text-blue-100',
                             'bg-amber-500/10 border-amber-500 text-amber-100',
                             'bg-cyan-500/10 border-cyan-500 text-cyan-100',
                             'bg-purple-500/10 border-purple-500 text-purple-100',
                             'bg-emerald-500/10 border-emerald-500 text-emerald-100'
                         ];
                         const colorCls = colors[idx % colors.length];

                         return (
                             <div key={item.session_id} 
                                  className="absolute z-10 p-1"
                                  style={{
                                      top: `${topPercent}%`, 
                                      height: `${heightPercent}%`,
                                      left: `calc(80px + (100% - 80px) * ${(col - 1) * 0.2} + ((100% - 80px) * 0.2 / ${overlapCount}) * ${overlapIndex})`,
                                      width: `calc((100% - 80px) * 0.2 / ${overlapCount})`
                                  }}>
                                <div className={`border-l-4 h-full rounded-lg p-2 shadow-sm ${colorCls} overflow-hidden hover:brightness-125 transition-all text-ellipsis`}>
                                    <h4 className="text-[11px] font-manrope font-bold leading-tight">{item.course?.name} ({item.course?.id})</h4>
                                    <p className="text-[9px] font-medium mt-1 opacity-80">{item.professor?.name}</p>
                                    <p className="text-[9px] font-medium opacity-80">{item.room?.name}</p>
                                </div>
                             </div>
                         );
                      });
                  })()}
                  
                  {timetable.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-bold z-0">
                          <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">block</span>
                          <p>No valid schedule could be generated.</p>
                          <p className="font-normal text-xs text-slate-400 mt-1">Please check your constraints, ensure CSVs are correct, and re-run the algorithm.</p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-sm font-manrope font-bold uppercase tracking-widest text-blue-200 mb-4">Solution Quality</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-blue-100 font-body">Hard Constraints</span>
                    <span className="text-2xl font-manrope font-black">{qualityScore}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all" style={{width: `${qualityScore}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-manrope font-bold text-white">Metrics Summary</h3>
              {metrics ? (
                  <div className="space-y-4 text-sm font-medium text-slate-300">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-500">Nodes Expanded:</span>
                          <span className="text-blue-400">{metrics.nodes_expanded}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-500">Backtrack Count:</span>
                          <span className="text-red-400">{metrics.backtrack_count}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-slate-500">Time Taken:</span>
                          <span className="text-emerald-400">{metrics.time_taken_ms?.toFixed(2)} ms</span>
                      </div>
                  </div>
              ) : (
                  <div className="text-slate-500 text-sm">Run algorithm to see metrics.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
