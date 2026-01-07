import { PlayCircle, Clock, User, Zap, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SimpleLineChart } from '../../components/ui/SimpleLineChart';
import { useNavigate } from 'react-router-dom';

const ANALYTICS_DATA = {
  weeklyViews: [1200, 1500, 1100, 1800, 2400, 3100, 2800],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '総再生数', value: '124.5k', trend: '+12%', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '平均維持率', value: '42%', trend: '-2%', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'フォロワー増減', value: '+8.5%', trend: '+8.5%', icon: User, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'エンゲージメント', value: '5.2%', trend: '+0.4%', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">週間再生数推移</h3>
            <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 border p-1 outline-none">
              <option>過去7日間</option>
              <option>過去30日間</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <SimpleLineChart data={ANALYTICS_DATA.weeklyViews} labels={ANALYTICS_DATA.labels} />
          </div>
        </div>

        {/* AI Diagnosis */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI診断・改善提案
          </h3>
          <div className="space-y-4 flex-1">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">冒頭3秒の離脱率が高いです</h4>
                  <p className="text-xs text-gray-500 mt-1">開始3秒以内に40%が離脱しています。</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3 mb-2">
                <TrendingUp className="w-5 h-5 mt-0.5 text-green-500" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">保存率が上昇トレンドです</h4>
                  <p className="text-xs text-gray-500 mt-1">「レシピ系」の投稿が好評です。</p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('/planning')} className="w-full mt-4" variant="primary">
            対策用の企画を見る
          </Button>
        </div>
      </div>
    </div>
  );
};