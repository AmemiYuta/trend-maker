import { ChevronRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// モックデータ（本来はデータベースから取得します）
const SCHEDULE_DATA = [
  { id: 1, date: '2023-10-25', title: 'コンビニスイーツASMR', status: 'posted', type: 'video' },
  { id: 2, date: '2023-10-27', title: '行列グルメレポ', status: 'scheduled', type: 'video' },
  { id: 3, date: '2023-10-29', title: 'ハロウィン限定メニュー', status: 'draft', type: 'idea' },
];

export const CalendarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm min-h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-xl font-bold text-gray-900">投稿カレンダー</h2>
          <p className="text-sm text-gray-500">2023年 10月</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-sm px-2"><ChevronRight className="w-4 h-4 rotate-180" /></Button>
          <Button variant="secondary" className="text-sm">今日</Button>
          <Button variant="secondary" className="text-sm px-2"><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="primary" onClick={() => navigate('/planning')}>
            <PlusCircle className="w-4 h-4" /> 企画を追加
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="grid grid-cols-7 gap-4 auto-rows-fr h-full">
          {/* Days Header */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{d}</div>
          ))}
          
          {/* Calendar Cells (35マス分生成) */}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 1; // 適当な日付調整（デモ用）
            const isCurrentMonth = day > 0 && day <= 31;
            // 日付文字列を生成 (例: 2023-10-05)
            const dateStr = `2023-10-${day.toString().padStart(2, '0')}`;
            // その日のイベントを探す
            const events = SCHEDULE_DATA.filter(e => e.date === dateStr);

            return (
              <div 
                key={i} 
                className={`bg-white rounded-xl border p-2 flex flex-col gap-1 min-h-[100px] transition-shadow hover:shadow-md ${
                  isCurrentMonth ? 'border-gray-200' : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <span className={`text-sm font-bold ${isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}`}>
                  {isCurrentMonth ? day : ''}
                </span>
                
                {/* Events */}
                {events.map(ev => (
                  <div key={ev.id} className={`p-1.5 rounded-lg text-[10px] font-bold truncate border ${
                    ev.status === 'posted' ? 'bg-green-50 text-green-700 border-green-100' :
                    ev.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-gray-50 text-gray-500 border-gray-200 dashed'
                  }`}>
                    {ev.status === 'posted' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};