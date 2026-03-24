import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InputManagement from './pages/InputManagement';
import ConflictResolution from './pages/ConflictResolution';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import TimetableOutput from './pages/TimetableOutput';
import AlgorithmVisualisation from './pages/AlgorithmVisualisation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inputs" replace />} />
        <Route path="/inputs" element={<InputManagement />} />
        <Route path="/conflict" element={<ConflictResolution />} />
        <Route path="/analytics" element={<PerformanceAnalytics />} />
        <Route path="/results" element={<TimetableOutput />} />
        <Route path="/visualiser" element={<AlgorithmVisualisation />} />
      </Routes>
    </Router>
  );
}

export default App;
