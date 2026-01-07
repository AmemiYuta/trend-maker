import { useState, useEffect } from 'react';
import { Share2, ArrowLeft, PlusCircle } from 'lucide-react'; // PlusCircleを追加
import { Button } from '../../components/ui/Button';
import { VideoStructureChart } from './components/VideoStructureChart';
import type { Idea } from '../../types/idea';
import { supabase } from '../../lib/supabase';
import { AddIdeaModal } from './components/AddIdeaModal'; // ★追加

export const PlanningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('gourmet');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ★追加: モーダルの開閉状態
  const [isModalOpen, setIsModalOpen] = useState(false);

  // データを取得する関数（使い回せるように外に出しました）
  const fetchIdeas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('category', selectedCategory)
      .order('created_at', { ascending: false }); // 新しい順に並び替え

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setIdeas(data || []);
    }
    setLoading(false);
  };

  // 初回とカテゴリ変更時にデータ取得
  useEffect(() => {
    fetchIdeas();
  }, [selectedCategory]);

  return (
    <div className="h-full flex flex-col gap-6"> {/* レイアウト調整 */}
      
      {/* ★追加: モーダルコンポーネント */}
      <AddIdeaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={() => {
          fetchIdeas(); // 追加されたらリストを再読み込み
        }} 
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ネタ・企画提案</h2>
        {/* ★追加: 新規作成ボタン */}
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-4 h-4" />
          新規作成
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0"> {/* min-h-0でスクロール制御 */}
        
        {/* 左側: リスト表示エリア */}
        <div className={`${selectedIdea ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 mb-3">ジャンル選択</h3>
            <div className="flex gap-2">
              {['gourmet', 'beauty', 'vlog'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSelectedIdea(null); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loading && <p className="text-center text-gray-400 py-4">読み込み中...</p>}

            {!loading && ideas.map((idea) => (
              <div 
                key={idea.id} 
                onClick={() => setSelectedIdea(idea)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedIdea?.id === idea.id
                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{idea.time}</span>
                  <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">{idea.difficulty}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{idea.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{idea.reason}</p>
              </div>
            ))}
            
            {!loading && ideas.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                <p className="text-sm">まだ企画がありません</p>
                <p className="text-xs mt-1">右上のボタンから追加してみよう</p>
              </div>
            )}
          </div>
        </div>

        {/* 右側: 詳細表示エリア */}
        <div className={`${!selectedIdea ? 'hidden lg:flex' : 'flex'} flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-col`}>
          {selectedIdea ? (
            <>
               <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
                  <div className="flex-1">
                    <button 
                      onClick={() => setSelectedIdea(null)}
                      className="lg:hidden mb-2 text-gray-500 flex items-center gap-1 text-sm font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" /> 戻る
                    </button>
                    <div className="flex gap-2 mb-2">
                      {selectedIdea.tags.map(tag => (
                        <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedIdea.title}</h2>
                  </div>
                  <Button variant="secondary" className="ml-4">
                    <Share2 className="w-4 h-4" />
                  </Button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                 <div className="max-w-3xl mx-auto">
                   <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">AI構成案 (デフォルト)</h3>
                   <VideoStructureChart structures={selectedIdea.structure} />
                 </div>
               </div>
               
               <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                  <Button variant="secondary">下書き保存</Button>
                  <Button variant="primary">台本をコピー</Button>
               </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <p className="font-bold text-lg text-gray-600">企画を選択してください</p>
              <p className="text-sm mt-2">左側のリストから気になる企画を選んで詳細を確認しましょう</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};