import { PlusCircle, Settings, Check, Lock, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// モックデータ: チームメンバー
const TEAM_MEMBERS = [
  { id: 'm1', name: 'Creator_One', role: 'Owner', avatar: 'C', status: 'Active' },
  { id: 'm2', name: 'Editor_Tanaka', role: 'Editor', avatar: 'E', status: 'Active' },
  { id: 'm3', name: 'Manager_Sato', role: 'Viewer', avatar: 'M', status: 'Invited' },
];

// モックデータ: 料金プラン
const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '¥0',
    features: ['1 SNSアカウント連携', '基本トレンド分析', '月10件の企画提案', '個人利用のみ'],
    current: true
  },
  {
    id: 'team',
    name: 'Team Plan',
    price: '¥2,980',
    period: '/月',
    features: ['無制限のSNSアカウント', 'チームメンバー招待 (5名まで)', '高度な視聴者分析', '投稿カレンダー共有', '優先サポート'],
    recommended: true
  }
];

export const TeamPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* 1. ヘッダーエリア */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            チームメンバー
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {TEAM_MEMBERS.length} / 5名
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            動画編集者やマネージャーを招待して、効率的に運用しましょう。
          </p>
        </div>
        <Button variant="primary" className="shrink-0">
          <PlusCircle className="w-4 h-4" /> メンバーを招待
        </Button>
      </div>

      {/* 2. メンバー一覧テーブル */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {member.avatar}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {/* ロックされた行（プラン制限の演出） */}
            {[1, 2].map((i) => (
              <tr key={i} className="bg-gray-50/50">
                <td className="px-6 py-4" colSpan={4}>
                  <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">追加枠 (Team Planで解放)</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. プラン比較セクション */}
      <div className="pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">プランをアップグレード</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`rounded-2xl p-6 border-2 flex flex-col relative transition-all duration-300 ${
                plan.recommended 
                  ? 'border-orange-200 bg-white shadow-xl scale-100 md:scale-105 z-10' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> RECOMMENDED
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.recommended ? 'text-orange-500' : 'text-gray-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.recommended ? 'upgrade' : 'secondary'} 
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? '現在のプラン' : '14日間無料で試す'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};