import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';

export default function TimetableOutput() {
  const [timetable, setTimetable] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  
  useEffect(() => {
    fetchTimetable();
    fetchMetrics();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/timetable/');
      const data = await res.json();
      setTimetable(data.timetable || []);
      
      // Detect conflicts
      const detectedConflicts = [];
      const timeGroups = {};
      
      data.timetable?.forEach(item => {
        const day = item.time_slot?.day;
        const startTime = item.time_slot?.start_time;
        const key = `${day}-${startTime}`;
        if (!timeGroups[key]) timeGroups[key] = [];
        timeGroups[key].push(item);
        
        // Check for conflicts (same room, same time)
        const sameTimeSlots = timeGroups[key];
        if (sameTimeSlots.length > 1) {
          const rooms = sameTimeSlots.map(s => s.room?.id);
          const uniqueRooms = [...new Set(rooms)];
          if (uniqueRooms.length < sameTimeSlots.length) {
            detectedConflicts.push({
              time: key,
              day: day,
              startTime: startTime,
              items: sameTimeSlots
            });
          }
        }
      });
      
      setConflicts(detectedConflicts);
    } catch {}
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/performance/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch {}
  };

  // Grid constants
  const HOUR_START = 8;   // 08:00
  const HOUR_END = 18;    // up to 18:00
  const TOTAL_HOURS = HOUR_END - HOUR_START; // 10
  const GRID_HOURS = Array.from({ length: TOTAL_HOURS }, (_, i) => `${String(HOUR_START + i).padStart(2, '0')}:00`);

  const dayColMap = {
    'M': 0,  // Monday
    'T': 1,  // Tuesday  
    'W': 2,  // Wednesday
    'R': 3,  // Thursday
    'F': 4,  // Friday
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
  };

  const getTopPercent = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    const offsetHours = (h + m / 60) - HOUR_START;
    return (offsetHours / TOTAL_HOURS) * 100;
  };

  const getHeightPercent = (duration) => {
    const hrs = parseFloat(duration) || 1;
    return (hrs / TOTAL_HOURS) * 100;
  };

  const handleExport = () => {
    if (!timetable.length) return;
    const rows = [['Course ID', 'Course Name', 'Professor', 'Room', 'Day', 'Start Time', 'End Time']];
    timetable.forEach(item => {
      rows.push([
        item.course?.id ?? '',
        item.course?.name ?? '',
        item.professor?.name ?? '',
        item.room?.name ?? '',
        item.time_slot?.day ?? '',
        item.time_slot?.start_time ?? '',
        item.time_slot?.end_time ?? '',
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const qualityScore = metrics && metrics.nodes_expanded > 0 ? (conflicts.length === 0 ? 100 : Math.max(0, 100 - (conflicts.length * 20))) : 0;

  return (
    <Layout title="Timetable Output Hub">
      <div className="p-8 space-y-8 max-w-[1600px] h-[calc(100vh-60px)] overflow-y-auto mt-[60px]">
        
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-manrope font-extrabold text-white tracking-tight">Timetable Output</h2>
            <p className="text-slate-400 font-body">Viewing latest generated optimal schedule.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} disabled={!timetable.length} className="bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
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
                {/* Day headers */}
                <div className="h-12 bg-slate-900 border-b border-slate-800"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                   <div key={d} className="h-12 bg-slate-900 flex items-center justify-center border-l border-slate-800 border-b border-slate-800 font-manrope font-bold text-xs uppercase tracking-widest text-slate-500">{d}</div>
                ))}

                {/* Body */}
                <div className="col-span-6 grid grid-cols-[80px_repeat(5,1fr)] relative" style={{ height: `${TOTAL_HOURS * 60}px` }}>
                  {/* Horizontal hour lines */}
                  {GRID_HOURS.map((_, i) => (
                    <div key={i} className="absolute w-full border-t border-slate-800/60" style={{ top: `${(i / TOTAL_HOURS) * 100}%` }} />
                  ))}
                  {/* Vertical day dividers */}
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="absolute top-0 bottom-0 border-l border-slate-800/60"
                      style={{ left: `calc(80px + (100% - 80px) * ${(i) * 0.2})` }} />
                  ))}

                  {/* Time labels */}
                  {GRID_HOURS.map((t, i) => (
                    <span key={t} className="absolute text-[10px] font-bold text-slate-500 w-[72px] text-right pr-3 leading-none"
                      style={{ top: `calc(${(i / TOTAL_HOURS) * 100}% - 6px)` }}>
                      {t}
                    </span>
                  ))}

                  {/* Timetable blocks */}
                  {(() => {
                    // Group by day+time to detect true overlaps
                    const timeGroups = {};
                    const conflicts = [];
                    
                    timetable.forEach(item => {
                      const day = item.time_slot?.day;
                      const startTime = item.time_slot?.start_time;
                      const key = `${day}-${startTime}`;
                      if (!timeGroups[key]) timeGroups[key] = [];
                      timeGroups[key].push(item);
                      
                      // Check for conflicts (same room, same time)
                      const sameTimeSlots = timeGroups[key];
                      if (sameTimeSlots.length > 1) {
                        const rooms = sameTimeSlots.map(s => s.room?.id);
                        const uniqueRooms = [...new Set(rooms)];
                        if (uniqueRooms.length < sameTimeSlots.length) {
                          conflicts.push({time: key, items: sameTimeSlots});
                        }
                      }
                    });

                    const colors = [
                      'border-blue-500 bg-blue-500/10 text-blue-100',
                      'border-amber-500 bg-amber-500/10 text-amber-100',
                      'border-cyan-500 bg-cyan-500/10 text-cyan-100',
                      'border-purple-500 bg-purple-500/10 text-purple-100',
                      'border-emerald-500 bg-emerald-500/10 text-emerald-100',
                      'border-red-500 bg-red-500/10 text-red-100', // for conflicts
                    ];

                    return timetable.map((item, idx) => {
                      const day = item.time_slot?.day;
                      const colIndex = dayColMap[day]; // 0-based
                      if (colIndex === undefined || !item.time_slot?.start_time) return null;

                      const key = `${day}-${item.time_slot.start_time}`;
                      const group = timeGroups[key];
                      const overlapCount = group.length;
                      const overlapIndex = group.findIndex(g => g.session_id === item.session_id);
                      
                      // Check if this item is in conflict
                      const isConflict = conflicts.some(c => c.time === key && c.items.some(i => i.session_id === item.session_id));

                      const topPct = getTopPercent(item.time_slot.start_time);
                      const heightPct = getHeightPercent(item.course?.duration);
                      let colorCls = colors[idx % (colors.length - 1)]; // exclude red color
                      if (isConflict) {
                        colorCls = colors[5]; // red for conflicts
                      }

                      // Each day column occupies (100% - 80px) / 5 of width
                      // Within that column, split by overlap
                      const colWidthExpr = `(100% - 80px) / 5`;
                      const leftExpr = `80px + ${colIndex} * (${colWidthExpr}) + ${overlapIndex} * (${colWidthExpr}) / ${overlapCount}`;
                      const widthExpr = `(${colWidthExpr}) / ${overlapCount}`;

                      return (
                        <div key={item.session_id}
                          className={`absolute z-10 px-0.5 ${isConflict ? 'z-20' : ''}`}
                          style={{
                            top: `${topPct}%`,
                            height: `${heightPct}%`,
                            left: `calc(${leftExpr})`,
                            width: `calc(${widthExpr})`,
                          }}>
                          <div className={`border-l-4 h-full rounded-lg p-2 overflow-hidden hover:brightness-125 transition-all ${colorCls} ${isConflict ? 'animate-pulse border-2' : ''}`}>
                            <p className="text-[11px] font-bold leading-tight truncate">{item.course?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 truncate">{item.course?.id}</p>
                            <p className="text-[9px] mt-1 opacity-70 truncate">{item.professor?.name}</p>
                            <p className="text-[9px] opacity-70 truncate">{item.room?.name}</p>
                            {isConflict && (
                              <p className="text-[8px] mt-1 text-red-400 font-bold">⚠️ CONFLICT</p>
                            )}
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
            {conflicts.length > 0 && (
              <div className="bg-red-900/50 border border-red-800/50 rounded-xl p-6 space-y-4">
                <h3 className="font-manrope font-bold text-red-400 flex items-center gap-2">
                  <span className="material-symbols-outlined">warning</span>
                  Schedule Conflicts ({conflicts.length})
                </h3>
                <div className="space-y-3">
                  {conflicts.map((conflict, idx) => (
                    <div key={idx} className="bg-red-950/50 rounded-lg p-3 border border-red-800/30">
                      <div className="text-sm font-bold text-red-300 mb-2">
                        {conflict.day} {conflict.startTime}
                      </div>
                      <div className="space-y-1">
                        {conflict.items.map((item, i) => (
                          <div key={i} className="text-xs text-slate-300">
                            • {item.course?.id} - {item.room?.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-red-400">
                  ⚠️ Multiple classes scheduled in the same room at the same time
                </p>
              </div>
            )}

            <div className={`text-white p-6 rounded-xl shadow-lg relative overflow-hidden ${conflicts.length > 0 ? 'bg-orange-600' : 'bg-blue-600'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-sm font-manrope font-bold uppercase tracking-widest text-white/80 mb-4">Solution Quality</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-white/90 font-body">Hard Constraints</span>
                    <span className="text-2xl font-manrope font-black">{qualityScore}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all" style={{width: `${qualityScore}%`}}></div>
                  </div>
                  {conflicts.length > 0 && (
                    <p className="text-xs text-white/70 mt-2">
                      {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected
                    </p>
                  )}
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
