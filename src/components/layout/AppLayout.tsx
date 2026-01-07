import { Outlet, NavLink } from 'react-router-dom';
import { Layout, Sparkles, Calendar, Users, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AppLayout = () => {
  const navItems = [
    { to: '/dashboard', label: 'ダッシュボード', icon: Layout },
    { to: '/planning', label: 'ネタ・企画提案', icon: Sparkles },
    { to: '/calendar', label: 'カレンダー', icon: Calendar },
    { to: '/analytics', label: '詳細分析', icon: BarChart2 },
    { to: '/team', label: 'チーム管理', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-10 md:relative hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Trend Maker</h1>
            <p className="text-[10px] text-gray-400 font-medium">for Creators</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* ここに各ページの中身が表示されます */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};