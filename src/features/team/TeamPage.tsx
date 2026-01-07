import { useEffect, useState } from 'react';
import { Users, Crown, UserPlus, CheckCircle } from 'lucide-react'; // アイコン追加
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { useWorkspace } from '../../hooks/useWorkspace';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  email: string; // 直接取得できるようになるのでシンプルになります
}

export const TeamPage = () => {
  const { team, loading: workspaceLoading } = useWorkspace();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // メンバー一覧を取得
  useEffect(() => {
    const fetchMembers = async () => {
      if (!team) return;
      
      try {
        // ★修正: さきほど作った関数(RPC)経由でデータを取得
        const { data, error } = await supabase
          .rpc('get_team_members_with_email', { 
            t_id: team.id 
          });

        if (error) throw error;
        
        // データ整形が不要になり、そのままセットできます
        setMembers(data as TeamMember[]);
      } catch (err) {
        console.error('メンバー取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    if (team) {
      fetchMembers();
    }
  }, [team]);

  if (workspaceLoading || loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">データを読み込み中...</div>;
  }

  const isFreePlan = team?.plan_type === 'free';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* ヘッダーエリア */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-600" />
            チームメンバー管理
          </h2>
          <p className="text-gray-500 font-bold mt-2">
            プロジェクトを共有するメンバーを管理します
          </p>
        </div>
      </div>

      {/* Freeプランの場合の制限バナー */}
      {isFreePlan && (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Crown className="w-40 h-40 transform rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                Teamプランにアップグレード
              </h3>
              <p className="text-indigo-200 text-sm mb-4">
                現在はFreeプランのため、自分1人での利用に限られます。<br />
                メンバーを追加して、チームで企画・構成を共有しましょう。
              </p>
              <div className="flex gap-4 text-xs font-bold text-indigo-100">
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> メンバー無制限</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> SNS連携無制限</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 権限管理</span>
              </div>
            </div>
            <div className="shrink-0">
              <Button variant="upgrade" size="lg">
                プランを変更する
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* メンバーリスト */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            所属メンバー ({members.length}名)
          </h3>
          {!isFreePlan ? (
            <Button size="sm" className="gap-1">
              <UserPlus className="w-4 h-4" /> メンバーを招待
            </Button>
          ) : (
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
              メンバー追加はTeamプランのみ
            </span>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {member.email?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{member.email}</p>
                  <p className="text-xs text-gray-500">参加日: {new Date(member.joined_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold border
                  ${member.role === 'owner' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : 'bg-gray-50 text-gray-600 border-gray-200'}
                `}>
                  {member.role === 'owner' ? 'オーナー' : 'メンバー'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};