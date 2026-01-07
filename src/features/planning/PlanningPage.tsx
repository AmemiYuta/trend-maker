import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PlusCircle } from 'lucide-react';

export const PlanningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('gourmet');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ネタ・企画提案</h2>
          <p className="text-sm text-gray-500">AIがトレンドに基づいた企画を提案します</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4" />
          カスタム企画を作成
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[500px]">
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
          {['gourmet', 'beauty', 'vlog'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                selectedCategory === cat 
                ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' 
                : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {cat === 'gourmet' ? 'グルメ系' : cat === 'beauty' ? '美容系' : 'Vlog'}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 font-bold">「{selectedCategory}」の企画リスト</p>
            <p className="text-xs text-gray-400 mt-2">ここに以前のデータやAI提案を表示します</p>
          </div>
        </div>
      </div>
    </div>
  );
};