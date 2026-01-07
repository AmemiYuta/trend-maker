import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void; // 追加完了後にリストを更新するための関数
}

export const AddIdeaModal = ({ isOpen, onClose, onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('gourmet');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    // Supabaseにデータを追加
    const { error } = await supabase.from('ideas').insert([
      {
        title: title,
        category: category,
        // 入力が面倒な項目は一旦デフォルト値を入れておく（後で編集機能を作るのもアリ）
        tags: ['#アイデア', `#${category}`],
        difficulty: '中',
        time: '30秒',
        reason: '新規追加されたアイデアです',
        structure: [
          { time: "0-5秒", label: "導入", content: "動画のフックになる映像", memo: "" },
          { time: "5-30秒", label: "本編", content: "メインのコンテンツ", memo: "" }
        ]
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      alert('エラーが発生しました: ' + error.message);
    } else {
      setTitle(''); // 入力をクリア
      onAdded();    // 親コンポーネントに通知
      onClose();    // 閉じる
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">新しい企画を追加</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">カテゴリー</label>
            <div className="flex gap-2">
              {['gourmet', 'beauty', 'vlog'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                    category === cat 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">企画タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 渋谷の隠れ家カフェvlog"
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
              autoFocus
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
            <Button type="submit" disabled={!title || isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '追加する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};