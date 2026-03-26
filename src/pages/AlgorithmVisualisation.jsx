import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import CSP3DVisualization from '../components/CSP3DVisualization';

export default function AlgorithmVisualisation() {
  const [steps, setSteps] = useState([]);
  const [metrics, setMetrics] = useState({ nodes_expanded: 0, backtrack_count: 0, time_taken_ms: 0 });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const timerRef = useRef(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/performance/metrics');
      const data = await res.json();
      if (data && data.nodes_expanded) {
          setMetrics(data);
      }
    } catch {}
  };

  const handle3DModeToggle = () => {
    const new3DMode = !is3DMode;
    setIs3DMode(new3DMode);
    
    // Auto-enter fullscreen when switching to 3D mode
    if (new3DMode) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setSteps([]);
    setCurrentStepIndex(0);
    try {
      await fetch('http://127.0.0.1:8000/api/solve', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(["mrv", "mcv", "lcv"])
      });
      fetchMetrics();
      
      const res = await fetch('http://127.0.0.1:8000/api/visualization/state');
      const data = await res.json();
      setSteps(data.steps || []);
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSolving(false);
    }
  };

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 500); // 500ms per step
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps]);

  const currentState = steps[currentStepIndex] || null;
  const assignments = currentState ? Object.entries(currentState.assignment || {}) : [];
  const conflictSet = currentState ? Object.entries(currentState.conflict_set || {}) : [];

  return (
    <Layout title="Algorithm Visualisation Dashboard">
      <div className={`mt-[60px] ${isFullScreen ? 'p-0' : 'p-6'} ${isFullScreen ? 'h-screen' : 'grid grid-cols-12 gap-6 h-[calc(100vh-60px)]'}`}>
        {isFullScreen ? (
          // Full screen 3D mode
          <div className="relative w-full h-full">
            {/* Full screen controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button 
                onClick={handleFullScreenToggle}
                className="px-3 py-2 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-slate-800/80 text-sm font-bold"
              >
                <span className="material-symbols-outlined text-lg">fullscreen_exit</span>
              </button>
              <button 
                onClick={handle3DModeToggle}
                className="px-3 py-2 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-slate-800/80 text-sm font-bold"
              >
                2D View
              </button>
            </div>
            
            {/* 3D Visualization */}
            <div className="w-full h-full">
              <CSP3DVisualization
                currentState={currentState}
                conflictSet={currentState ? Object.entries(currentState.conflict_set || {}) : []}
                assignments={assignments}
                steps={steps}
                currentStepIndex={currentStepIndex}
              />
            </div>
          </div>
        ) : (
          // Normal layout
          <>
            <section className="col-span-9 flex flex-col gap-6">
              <div className="flex-1 bg-surface-container-low/30 rounded-2xl relative overflow-hidden flex flex-col border border-outline-variant/10">
                <div className="p-6 flex justify-between items-start z-10">
                  <div>
                    <h2 className="font-headline font-bold text-xl text-blue-100">Solver Engine</h2>
                    <p className="text-sm text-slate-500">Real-time CSP state exploration</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    {isSolving ? (
                        <span className="text-blue-400 font-bold animate-pulse text-sm">Engine Running...</span>
                    ) : (
                        <>
                            <button 
                              onClick={handle3DModeToggle} 
                              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 text-sm"
                            >
                              {is3DMode ? '2D View' : '3D View'}
                            </button>
                            <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0} className="px-4 py-2 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 disabled:opacity-50 text-sm">
                                {isPlaying ? 'Pause Playback' : (steps.length > 0 ? 'Resume Playback' : 'Waiting')}
                            </button>
                            <button onClick={handleSolve} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                                Start CSP Solver
                            </button>
                        </>
                    )}
                  </div>
                </div>

            <div className="flex-1 relative p-8 flex items-center justify-center">
              {/* 3D or 2D Visualization */}
              {is3DMode ? (
                <div className="w-full h-full rounded-xl overflow-hidden border border-white/5">
                  <CSP3DVisualization
                    currentState={currentState}
                    conflictSet={currentState ? Object.entries(currentState.conflict_set || {}) : []}
                    assignments={assignments}
                    steps={steps}
                    currentStepIndex={currentStepIndex}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-900/40 rounded-xl border border-white/5">
                  {currentState ? (
                       <div className="text-center z-10 absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm p-8">
                         <h3 className="text-3xl font-black text-blue-400 font-manrope">Step {currentState.step} / {steps.length}</h3>
                         <div className="flex gap-4 mt-4">
                             <div className={`px-6 py-3 rounded-2xl border ${currentState.action === 'assign' ? 'border-blue-500 bg-blue-500/10' : currentState.action === 'backtrack' ? 'border-red-500 bg-red-500/10' : currentState.action === 'forward_check_prune' ? 'border-amber-500 bg-amber-500/10' : 'border-green-500 bg-green-500/10'}`}>
                                 <span className="text-xs uppercase tracking-widest font-black text-slate-500 block mb-1">Action</span>
                                 <span className={`text-xl font-bold ${currentState.action === 'assign' ? 'text-blue-400' : currentState.action === 'backtrack' ? 'text-red-400' : currentState.action === 'forward_check_prune' ? 'text-amber-400' : 'text-green-400'}`}>
                                     {currentState.action.replace(/_/g, ' ')}
                                 </span>
                             </div>
                             <div className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5">
                                 <span className="text-xs uppercase tracking-widest font-black text-slate-500 block mb-1">Variable</span>
                                 <span className="text-xl font-bold text-white">{currentState.current_variable || 'N/A'}</span>
                             </div>
                             <div className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5">
                                 <span className="text-xs uppercase tracking-widest font-black text-slate-500 block mb-1">Value Assigned</span>
                                 <span className="text-xl font-bold text-white">{currentState.assigned_value || 'N/A'}</span>
                             </div>
                         </div>
                       </div>
                  ) : (
                      <div className="text-center text-slate-500 font-medium">Click "Start CSP Solver" to begin algorithm tracing.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="h-48 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10 p-6 overflow-y-auto">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Domain Reduction Tracking (Forward Checking)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {conflictSet.map(([vId, domain]) => (
                 <div key={vId} className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-blue-300">{vId}</span>
                     <span className="text-[9px] text-slate-500">{domain.length} rem</span>
                   </div>
                   <div className="flex flex-wrap gap-1">
                     {domain.slice(0, 10).map((d, i) => (
                        <div key={i} className="px-1 h-5 bg-blue-600/40 border border-blue-500/50 rounded flex items-center justify-center text-[9px] truncate max-w-[50px]">{d}</div>
                     ))}
                     {domain.length > 10 && <span className="text-xs text-slate-500">...</span>}
                     {domain.length === 0 && <span className="text-[9px] text-red-500 font-bold border border-red-500 px-1 rounded">Domain Wipeout!</span>}
                   </div>
                 </div>
              ))}
              {conflictSet.length === 0 && <div className="col-span-12 text-slate-500 text-sm italic">No active reduction data.</div>}
            </div>
          </div>
        </section>

        <aside className="col-span-3 flex flex-col gap-6">
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10 space-y-8 flex-1">
            <div>
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Search State</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                  <span className="text-xs text-slate-400">Nodes Expanded</span>
                  <span className="font-manrope font-extrabold text-2xl text-on-surface">{currentState ? currentState.step : (metrics?.nodes_expanded || 0)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                  <span className="text-xs text-slate-400">Total Backtracks</span>
                  <span className="font-manrope font-extrabold text-2xl text-error">{metrics?.backtrack_count || 0}</span>
                </div>
                <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                  <span className="text-xs text-slate-400">Computation Time</span>
                  <span className="font-manrope font-extrabold text-2xl text-on-surface">{metrics?.time_taken_ms ? metrics.time_taken_ms.toFixed(2) : 0}ms</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Current Assignment</h3>
              <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                {assignments.map(([k, v]) => (
                   <div key={k} className="p-3 bg-surface-container-lowest rounded-lg flex items-center gap-3 border border-outline-variant/5">
                     <div className="w-2 h-2 rounded-full bg-green-400"></div>
                     <span className="text-[10px] font-bold text-slate-300 w-12 truncate">{k}</span>
                     <span className="material-symbols-outlined text-[12px] text-slate-600">arrow_forward</span>
                     <span className="text-[10px] text-blue-400 font-mono truncate">{v}</span>
                   </div>
                ))}
                {assignments.length === 0 && !isSolving && <div className="text-sm text-slate-500 italic p-4 text-center">Empty assignment</div>}
              </div>
            </div>
          </div>
        </aside>
          </>
        )}
      </div>
    </Layout>
  );
}
