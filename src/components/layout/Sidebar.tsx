import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Moon, 
  X,
  ChevronUp,
  Building2 // 追加: ワークスペース用アイコン
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProfileSettingsModal } from '../../features/settings/ProfileSettingsModal';
import { WorkspaceSettingsModal } from '../../features/settings/WorkspaceSettingsModal'; // 追加

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // モーダル開閉ステート
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false); // 追加

  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  // ユーザー情報を取得
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        // メタデータから表示名を取得（設定されていなければメールの@前を表示）
        setDisplayName(user.user_metadata.display_name || user.email?.split('@')[0]);
      }
    };
    getUser();
  }, [isProfileSettingsOpen]); // プロフィール変更後に再取得

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
    { to: '/planning', icon: Lightbulb, label: 'ネタ・企画提案' },
    { to: '/calendar', icon: Calendar, label: '投稿カレンダー' },
    { to: '/team', icon: Users, label: 'チーム管理' },
  ];

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* --- モーダル定義 --- */}
      
      {/* プロフィール設定 */}
      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)}
        currentName={displayName}
      />

      {/* ワークスペース設定（SNS連携など） */}
      <WorkspaceSettingsModal
        isOpen={isWorkspaceSettingsOpen}
        onClose={() => setIsWorkspaceSettingsOpen(false)}
      />

      {/* --- サイドバー本体 --- */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        
        {/* ヘッダー */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-indigo-600 flex items-center gap-2">
            <span className="text-2xl">✨</span> Trend Maker
          </h1>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 最下部：アカウント設定エリア */}
        <div className="p-4 border-t border-gray-100 relative">
          
          {/* ポップアップメニュー */}
          {showUserMenu && (
            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
              <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-400">設定・管理</p>
              </div>
              
              {/* ワークスペース設定（追加） */}
              <button 
                onClick={() => { setIsWorkspaceSettingsOpen(true); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-indigo-600" /> 
                <span className="font-bold">ワークスペース設定</span>
              </button>

              {/* プロフィール設定 */}
              <button 
                onClick={() => { setIsProfileSettingsOpen(true); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> 表示名の変更
              </button>

              {/* その他 */}
              <button 
                onClick={() => alert('ダークモードは準備中です')}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Moon className="w-4 h-4" /> システムカラー
              </button>
              
              <div className="border-t border-gray-50 my-1"></div>
              
              {/* ログアウト */}
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
              >
                <LogOut className="w-4 h-4" /> ログアウト
              </button>
            </div>
          )}

          {/* ユーザーカード（クリックトリガー） */}
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
              showUserMenu ? 'bg-gray-50 border-gray-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </>
  );
};