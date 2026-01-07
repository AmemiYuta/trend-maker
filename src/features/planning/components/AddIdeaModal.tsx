import { useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../../lib/supabase'; // パスは環境に合わせて調整してください
import { Button } from '../../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const AddIdeaModal = ({ isOpen, onClose, onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('gourmet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ★追加: AI処理中かどうかのステータス
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  // 簡易的なタイトル提案（ここはモックのまま残しています）
  const handleAiSuggestTitle = async () => {
    // 既存のモック処理（ランダム提案）...
    const suggestions: Record<string, string[]> = {
      gourmet: ['【大阪】絶対に行くべき隠れ家ランチ5選', '並んでも食べたい！極厚パンケーキ', '1000円以下最強せんべろ'],
      beauty: ['毎朝3分で終わる時短メイク術', '韓国コスメ縛りでフルメイク', '冬の乾燥対策スキンケア'],
      vlog: ['休日のまったりVlog', '仕事終わりのナイトルーティン', '弾丸京都旅行Vlog'],
    };
    const list = suggestions[category] || suggestions['gourmet'];
    setTitle(list[Math.floor(Math.random() * list.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setStatusMessage('AIが企画構成を考えています...');

    try {
      // 1. Edge Function (suggest-idea) を呼び出して構成案を生成
      const { data: aiData, error: aiError } = await supabase.functions.invoke('suggest-idea', {
        body: { title, category }
      });

      if (aiError) throw new Error('AI生成エラー: ' + aiError.message);

      // AIが返してくれたデータ（structure, reason, tagsなど）
      console.log('AI Result:', aiData);

      setStatusMessage('データベースに保存中...');

      // 2. AIのデータを混ぜてDBに保存
      const { error: dbError } = await supabase.from('ideas').insert([
        {
          title: title,
          category: category,
          // AIの生成データを使用（もし失敗して空ならデフォルト値へフォールバック）
          tags: aiData.tags || ['#アイデア'],
          difficulty: aiData.difficulty || '中',
          time: aiData.time || '30秒',
          reason: aiData.reason || 'AI自動生成',
          structure: aiData.structure || [],
          // created_at はSupabase側で自動設定されることが多いですが必要なら追加
        }
      ]);

      if (dbError) throw dbError;

      // 成功時
      setTitle('');
      onAdded();
      onClose();

    } catch (error: any) {
      alert('エラーが発生しました: ' + error.message);
    } finally {
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">新しい企画を追加</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* カテゴリ選択 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">カテゴリー</label>
            <div className="flex gap-2">
              {['gourmet', 'beauty', 'vlog'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                    category === cat 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* タイトル入力 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase">企画タイトル</label>
              <button
                type="button"
                onClick={handleAiSuggestTitle}
                className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700"
              >
                <Sparkles className="w-3 h-3" />
                ランダム提案
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 渋谷の隠れ家カフェvlog"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-2 flex flex-col gap-2">
            {/* ステータス表示 */}
            {isSubmitting && (
              <p className="text-center text-xs text-indigo-600 font-bold animate-pulse">
                <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                {statusMessage}
              </p>
            )}
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button type="submit" disabled={!title || isSubmitting}>
                {isSubmitting ? 'AI生成中...' : '追加する（AI構成生成）'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};