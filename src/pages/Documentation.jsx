import React from 'react';
import { Layout } from '../components/Layout';

export default function Documentation() {
  return (
    <Layout title="Documentation">
      <div className="mt-[60px] p-8 max-w-6xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-blue-400">UniPlan Documentation</h1>
            <p className="text-lg text-slate-400">Complete guide to the CSP-based university timetable scheduling system</p>
          </div>

          {/* Overview */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Overview</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                <strong>UniPlan</strong> is an intelligent university timetable scheduling system that uses 
                <strong> Constraint Satisfaction Problem (CSP)</strong> algorithms to generate optimal timetables 
                while avoiding conflicts and maximizing resource utilization.
              </p>
              <p>
                The system combines advanced constraint programming with an intuitive web interface to help 
                administrators create, manage, and visualize course schedules efficiently.
              </p>
            </div>
          </section>

          {/* System Architecture */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">System Architecture</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Frontend (React)</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Modern React application with Vite build system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Responsive UI with TailwindCSS styling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Interactive 2D/3D visualizations using React Three Fiber</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Real-time algorithm visualization and performance analytics</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Backend (Python)</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>FastAPI-based REST API server</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>CSP solver engine with advanced heuristics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Forward checking and constraint propagation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Performance metrics and solution tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CSP Solver Algorithm */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">CSP Solver Algorithm</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Core Concepts</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Variables</h4>
                    <p className="text-sm text-slate-400">Course sessions that need to be scheduled</p>
                  </div>
                  <div className="bg-surface-container-low/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Domains</h4>
                    <p className="text-sm text-slate-400">Available timeslots and rooms for each session</p>
                  </div>
                  <div className="bg-surface-container-low/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Constraints</h4>
                    <p className="text-sm text-slate-400">Rules that prevent conflicts (professor, room, student group)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Heuristics Used</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">MRV</span>
                    <div>
                      <strong>Minimum Remaining Values:</strong> Select variables with smallest domains first
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">MCV</span>
                    <div>
                      <strong>Most Constraining Variable:</strong> Select variables that constrain most others
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">LCV</span>
                    <div>
                      <strong>Least Constraining Value:</strong> Try values that eliminate fewest options
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Algorithm Flow</h3>
                <ol className="space-y-2 text-slate-300">
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-8 h-8 flex items-center justify-center">1</span>
                    <span>Select unassigned variable using heuristics</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-8 h-8 flex items-center justify-center">2</span>
                    <span>Try domain values in optimal order</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-8 h-8 flex items-center justify-center">3</span>
                    <span>Check constraint consistency</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-8 h-8 flex items-center justify-center">4</span>
                    <span>Apply forward checking to prune domains</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-8 h-8 flex items-center justify-center">5</span>
                    <span>Recurse or backtrack if needed</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Input Management</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Course and session creation</li>
                  <li>• Professor and student group management</li>
                  <li>• Room and timeslot configuration</li>
                  <li>• CSV import/export functionality</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Conflict Resolution</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Automatic conflict detection</li>
                  <li>• Smart constraint violation handling</li>
                  <li>• Manual override capabilities</li>
                  <li>• Real-time validation</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Algorithm Visualization</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Step-by-step solver execution</li>
                  <li>• Interactive 2D and 3D visualizations</li>
                  <li>• Domain reduction tracking</li>
                  <li>• Search tree exploration</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Performance Analytics</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Solver performance metrics</li>
                  <li>• Heuristic effectiveness analysis</li>
                  <li>• Resource utilization statistics</li>
                  <li>• Historical performance tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Guide */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">User Guide</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Getting Started</h3>
                <ol className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">1</span>
                    <div>
                      <strong>Navigate to Input Management:</strong> Add courses, professors, rooms, and timeslots
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">2</span>
                    <div>
                      <strong>Create Course Sessions:</strong> Define individual class sessions with requirements
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">3</span>
                    <div>
                      <strong>Run Solver:</strong> Start the CSP algorithm to generate timetable
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">4</span>
                    <div>
                      <strong>View Results:</strong> Check generated timetable and resolve any conflicts
                    </div>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">Advanced Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>3D Visualization:</strong> Switch to 3D mode for interactive constraint graph exploration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Performance Analysis:</strong> Monitor solver efficiency and compare heuristics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Conflict Resolution:</strong> Manually adjust constraints when automatic solving fails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Export Options:</strong> Save timetables in various formats (CSV, PDF, etc.)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">API Reference</h2>
            <div className="space-y-4">
              <p className="text-slate-300">The backend exposes a REST API at <code className="bg-slate-800 px-2 py-1 rounded">http://127.0.0.1:8000</code></p>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-200">Key Endpoints</h3>
                <div className="space-y-2">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <code className="text-blue-400">POST /api/solve</code>
                    <p className="text-sm text-slate-400 mt-1">Start CSP solver with specified heuristics</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <code className="text-blue-400">GET /api/visualization/state</code>
                    <p className="text-sm text-slate-400 mt-1">Get current solver state and step history</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <code className="text-blue-400">GET /api/performance/metrics</code>
                    <p className="text-sm text-slate-400 mt-1">Retrieve solver performance metrics</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <code className="text-blue-400">GET /api/timetable</code>
                    <p className="text-sm text-slate-400 mt-1">Get generated timetable results</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-surface-container/30 rounded-2xl p-8 border border-outline-variant/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-200">Common Issues</h3>
                  <div className="space-y-2">
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <h4 className="font-semibold text-red-400">Solver Not Finding Solution</h4>
                      <p className="text-sm text-slate-400 mt-1">Check for over-constrained schedules or insufficient resources</p>
                    </div>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                      <h4 className="font-semibold text-amber-400">Slow Performance</h4>
                      <p className="text-sm text-slate-400 mt-1">Try different heuristics or reduce problem complexity</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-200">Solutions</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>• Add more timeslots or rooms</li>
                    <li>• Relax some constraints if possible</li>
                    <li>• Use different heuristic combinations</li>
                    <li>• Check for data inconsistencies</li>
                    <li>• Monitor performance metrics for bottlenecks</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-slate-400">
              For more information, visit the{' '}
              <a href="https://github.com/RainboeStrykr/uniplan" className="text-blue-400 hover:text-blue-300 underline">
                GitHub repository
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
