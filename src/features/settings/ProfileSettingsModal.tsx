import { useState } from 'react';
import { X, Loader2, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
}

export const ProfileSettingsModal = ({ isOpen, onClose, currentName }: Props) => {
  const [name, setName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Supabaseのユーザーメタデータを更新
    const { error } = await supabase.auth.updateUser({
      data: { display_name: name }
    });

    setIsSubmitting(false);

    if (error) {
      alert('更新に失敗しました');
    } else {
      // 成功したらリロードして変更を反映（簡易的な更新）
      window.location.reload(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4" /> プロフィール設定
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">表示名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: クリエイター太郎"
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900"
            />
            <p className="text-xs text-gray-400 mt-2">
              チームメンバーや共有画面で表示される名前です。
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '変更を保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};