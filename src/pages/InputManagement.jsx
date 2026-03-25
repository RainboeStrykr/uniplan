import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';

export default function InputManagement() {
  const [activeTab, setActiveTab] = useState('courses');
  const [resources, setResources] = useState({ courses: [], professors: [], rooms: [], time_slots: [], student_groups: [] });
  const [constraints, setConstraints] = useState([]);
  
  const [uploadMessage, setUploadMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(null); // 'tab' | 'all' | null

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadMessage('Uploading...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvContent = event.target.result;
      try {
          const res = await fetch('http://127.0.0.1:8000/api/resources/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  resource_type: activeTab,
                  csv_content: csvContent
              })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setUploadMessage(`Success: ${data.message}`);
          fetchResources(); // Refresh the list
      } catch (err) {
          console.error(err);
          setUploadMessage(`Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-uploading same file
  };

  useEffect(() => {
    fetchResources();
    fetchConstraints();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/resources/resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  const fetchConstraints = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/constraints/constraints');
      const data = await res.json();
      setConstraints(data.constraints || []);
    } catch (err) {
      console.error("Failed to fetch constraints", err);
    }
  };


  const handleClear = async (type) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/resources/resources?resource_type=${type}`, {
        method: 'DELETE',
      });
      setUploadMessage(type === 'all' ? 'All data cleared.' : `${type} cleared.`);
      fetchResources();
    } catch (err) {
      console.error("Error clearing data", err);
    } finally {
      setConfirmClear(null);
    }
  };

  return (
    <Layout title="Input Management Hub">
      <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          
          <section className="bg-surface-container-low p-8 rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center group hover:border-blue-900 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-950/50 border border-blue-900/50 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h3 className="text-xl font-bold font-headline mb-2 text-slate-100 capitalize">Import {activeTab} via CSV</h3>
            <p className="text-slate-400 max-w-md text-sm mb-4">
               Drag and drop your university scheduling CSV here or
               <input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={handleFileUpload} />
               <label htmlFor="csv-upload" className="text-blue-400 font-bold cursor-pointer underline ml-1">browse files</label>.
            </p>
            {uploadMessage && <p className={`text-sm font-bold mb-4 ${uploadMessage.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{uploadMessage}</p>}
            <div className="flex gap-3">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded uppercase tracking-tighter">.CSV ONLY</span>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-2 font-bold transition-colors ${activeTab === 'courses' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>Courses</button>
              <button 
                onClick={() => setActiveTab('professors')}
                className={`px-6 py-2 font-bold transition-colors ${activeTab === 'professors' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>Professors</button>
              <button 
                onClick={() => setActiveTab('rooms')}
                className={`px-6 py-2 font-bold transition-colors ${activeTab === 'rooms' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>Rooms</button>
              <button 
                onClick={() => setActiveTab('student_groups')}
                className={`px-6 py-2 font-bold transition-colors ${activeTab === 'student_groups' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>Student Groups</button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 bg-surface-container-low p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-headline font-bold text-slate-100">Active Catalog</h4>
                  <div className="flex gap-2">
                    {confirmClear === 'tab' ? (
                      <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-red-300 font-medium">Clear all {activeTab}?</span>
                        <button onClick={() => handleClear(activeTab)} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">Yes</button>
                        <span className="text-red-800">|</span>
                        <button onClick={() => setConfirmClear(null)} className="text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmClear('tab')}
                        disabled={resources[activeTab]?.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined text-sm">delete_sweep</span>
                        Clear {activeTab}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        {activeTab === 'courses' && (
                          <>
                            <th className="px-4 pb-2">Code</th>
                            <th className="px-4 pb-2">Course Name</th>
                            <th className="px-4 pb-2">Duration</th>
                            <th className="px-4 pb-2">Room Type</th>
                          </>
                        )}
                        {activeTab === 'professors' && (
                          <>
                            <th className="px-4 pb-2">Prof ID</th>
                            <th className="px-4 pb-2">Name</th>
                            <th className="px-4 pb-2">Unavailable Slots</th>
                          </>
                        )}
                        {activeTab === 'rooms' && (
                          <>
                            <th className="px-4 pb-2">Room ID</th>
                            <th className="px-4 pb-2">Name</th>
                            <th className="px-4 pb-2">Capacity</th>
                            <th className="px-4 pb-2">Type</th>
                          </>
                        )}
                        {activeTab === 'student_groups' && (
                          <>
                            <th className="px-4 pb-2">Group ID</th>
                            <th className="px-4 pb-2">Name</th>
                            <th className="px-4 pb-2">Size</th>
                            <th className="px-4 pb-2">Courses</th>
                          </>
                        )}                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {activeTab === 'courses' && resources.courses.map(c => (
                        <tr key={c.id} className="bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
                          <td className="px-4 py-4 font-bold text-blue-300 rounded-l-xl">{c.id}</td>
                          <td className="px-4 py-4 text-slate-300">{c.name}</td>
                          <td className="px-4 py-4 text-slate-400">{c.duration} hrs</td>
                          <td className="px-4 py-4 rounded-r-xl">
                            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-900/50 text-[10px] font-bold rounded-full uppercase">{c.type}</span>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'professors' && resources.professors.map(p => (
                        <tr key={p.id} className="bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
                          <td className="px-4 py-4 font-bold text-blue-300 rounded-l-xl">{p.id}</td>
                          <td className="px-4 py-4 text-slate-300">{p.name}</td>
                          <td className="px-4 py-4 text-slate-400 rounded-r-xl">{p.unavailable_slots.join(', ') || 'Fully Available'}</td>
                        </tr>
                      ))}
                      {activeTab === 'rooms' && resources.rooms.map(r => (
                        <tr key={r.id} className="bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
                          <td className="px-4 py-4 font-bold text-blue-300 rounded-l-xl">{r.id}</td>
                          <td className="px-4 py-4 text-slate-300">{r.name}</td>
                          <td className="px-4 py-4 text-slate-400">{r.capacity} pax</td>
                          <td className="px-4 py-4 rounded-r-xl">
                             <span className="px-3 py-1 bg-amber-900/30 text-amber-400 border border-amber-900/50 text-[10px] font-bold rounded-full uppercase">{r.type}</span>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'student_groups' && resources.student_groups.map(sg => (
                        <tr key={sg.id} className="bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group">
                          <td className="px-4 py-4 font-bold text-blue-300 rounded-l-xl">{sg.id}</td>
                          <td className="px-4 py-4 text-slate-300">{sg.name}</td>
                          <td className="px-4 py-4 text-slate-400">{sg.size} students</td>
                          <td className="px-4 py-4 text-slate-400 rounded-r-xl text-xs">{(sg.course_ids || []).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {resources[activeTab]?.length === 0 && (
                    <div className="text-center py-8 text-slate-500 font-medium">No {activeTab.replace('_', ' ')} available.</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-high p-8 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold font-headline text-slate-100">Constraint Builder</h3>
                <p className="text-slate-400 text-sm">Active heuristics mapping from the CSP Engine.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {constraints.map((c, i) => (
                <div key={c.id} className={`p-6 bg-slate-950 rounded-xl border-l-4 ${i % 2 === 0 ? 'border-red-500/50 border-red-900/50' : 'border-amber-500/50 border-amber-900/50'}  border-r border-t border-b border-white/5`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${i%2===0 ? 'text-red-400 bg-red-950/50 border-red-900/50' : 'text-amber-400 bg-amber-950/50 border-amber-900/50'}`}>Hard Constraint</span>
                  </div>
                  <h5 className="font-bold mb-2 text-slate-200">{c.name}</h5>
                  <p className="text-slate-400 text-xs mb-4">{c.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:w-80 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-white/5">
            <h4 className="font-headline font-bold mb-6 flex items-center justify-between text-slate-100">
              Consistency Status
              <span className="material-symbols-outlined text-emerald-500 text-2xl">verified</span>
            </h4>
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Database Readiness</span>
                  <span className="text-xs font-bold text-blue-400">100%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{width: "100%"}}></div>
                </div>
              </div>
            </div>
          </div>

          {confirmClear === 'all' ? (
            <div className="bg-red-950/40 border border-red-800/50 p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <span className="material-symbols-outlined text-lg">warning</span>
                <span className="font-bold text-sm">Clear everything?</span>
              </div>
              <p className="text-xs text-slate-400">This removes all courses, professors, rooms, time slots and student groups from the server.</p>
              <div className="flex gap-2">
                <button onClick={() => handleClear('all')} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                  Yes, clear all
                </button>
                <button onClick={() => setConfirmClear(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear('all')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors text-sm font-bold">
              <span className="material-symbols-outlined text-lg">delete_forever</span>
              Clear All Data
            </button>
          )}

          <div className="bg-blue-600 text-white p-6 rounded-xl relative overflow-hidden group shadow-xl shadow-blue-900/20">            <div className="relative z-10">
              <h4 className="font-headline font-bold mb-2">Ready to Build?</h4>
              <p className="text-blue-100 text-xs mb-4">All inputs are synchronized. You can now proceed to the engine to generate the first draft.</p>
              <Link to="/visualiser" className="block text-center w-full bg-white text-blue-700 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                Go to Visualiser
              </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 text-white opacity-10 transform group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-9xl">auto_fix_high</span>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
