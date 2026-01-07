import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PlanningPage } from './features/planning/PlanningPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CalendarPage } from './features/calendar/CalendarPage'; // ★追加

// TeamPageはまだプレースホルダー
const TeamPlaceholder = () => (
  <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
    <h3 className="text-xl font-bold">チーム管理</h3>
    <p>開発中...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="planning" element={<PlanningPage />} />
          
          {/* ★ここを書き換え */}
          <Route path="calendar" element={<CalendarPage />} />
          
          <Route path="team" element={<TeamPlaceholder />} /> {/* Teamルートも追加 */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;