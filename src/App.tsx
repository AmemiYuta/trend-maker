import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase'; // Supabaseを追加
import { LoginPage } from './features/auth/LoginPage'; // ログインページを追加

import { AppLayout } from './components/layout/AppLayout';
import { PlanningPage } from './features/planning/PlanningPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { TeamPage } from './features/team/TeamPage';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 現在のログイン状態を確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. ログイン状態の変化（ログイン/ログアウト）を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 読み込み中は何も表示しない（チラつき防止）
  if (loading) return null;

  // ★もしログインしていなければ、ログイン画面だけを表示
  if (!session) {
    return <LoginPage />;
  }

  // ★ログインしていれば、いつものアプリ画面を表示
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;