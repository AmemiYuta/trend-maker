import { useState } from 'react';
import { X, Youtube, Instagram, Twitter, Video, Building2, User, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useWorkspace, type SnsPlatform } from '../../hooks/useWorkspace';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceSettingsModal = ({ isOpen, onClose }: Props) => {
  const { team, snsAccounts, loading, addSnsAccount } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'general' | 'sns'>('sns');

  if (!isOpen) return null;

  // SNSごとのアイコンとカラー定義
  const platforms = {
    youtube: { icon: Youtube, color: 'text-red-600', label: 'YouTube' },
    tiktok: { icon: Video, color: 'text-black', label: 'TikTok' },
    instagram: { icon: Instagram, color: 'text-pink-600', label: 'Instagram' },
    x: { icon: Twitter, color: 'text-blue-400', label: 'X (Twitter)' },
  };

  // ダミーの連携処理
  const handleConnect = (platform: SnsPlatform) => {
    const name = prompt(`${platform}のアカウント名を入力してください（例: @trend_maker）`);
    if (name) {
      addSnsAccount(platform, name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">ワークスペース設定</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* サイドバー（タブ） */}
          <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'general' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              基本設定
            </button>
            <button
              onClick={() => setActiveTab('sns')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'sns' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              SNS連携
            </button>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-8 overflow-y-auto">
            {loading ? (
              <p>読み込み中...</p>
            ) : (
              <>
                {/* 基本設定タブ */}
                {activeTab === 'general' && team && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 mb-2">現在のプラン</h4>
                      <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg text-indigo-900 uppercase">{team.plan_type} PLAN</p>
                          <p className="text-xs text-indigo-600">
                            {team.plan_type === 'free' ? '個人利用向けの基本プラン' : 'チーム向けプロフェッショナルプラン'}
                          </p>
                        </div>
                        {team.plan_type === 'free' && (
                          <Button size="sm">アップグレード</Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 mb-2">ワークスペース名</h4>
                      <input 
                        type="text" 
                        defaultValue={team.name}
                        className="w-full p-2 border rounded-lg font-bold text-gray-700"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {/* SNS連携タブ */}
                {activeTab === 'sns' && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 mb-4">連携済みアカウント</h4>
                      {snsAccounts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                          まだ連携されたアカウントはありません
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {snsAccounts.map((account) => {
                            const Meta = platforms[account.platform];
                            return (
                              <div key={account.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full bg-gray-50 ${Meta.color}`}>
                                    <Meta.icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-gray-900">{account.account_name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{account.platform}</p>
                                  </div>
                                </div>
                                <button className="text-xs text-red-500 hover:text-red-600 font-bold px-3 py-1">解除</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-500 mb-4">アカウントを追加</h4>
                      
                      {/* プランによる制限ロジックの例 */}
                      {team?.plan_type === 'free' && snsAccounts.length >= 1 && (
                        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg font-bold">
                          ⚠️ Freeプランでは1アカウントまでしか連携できません。
                          <br />チームプランにアップグレードして無制限に連携しましょう。
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(platforms) as SnsPlatform[]).map((key) => {
                          const Meta = platforms[key];
                          const isDisabled = team?.plan_type === 'free' && snsAccounts.length >= 1;
                          
                          return (
                            <button
                              key={key}
                              onClick={() => handleConnect(key)}
                              disabled={isDisabled}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                                isDisabled 
                                  ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' 
                                  : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-md'
                              }`}
                            >
                              <Meta.icon className={`w-6 h-6 ${Meta.color}`} />
                              <span className="font-bold text-sm text-gray-700">{Meta.label}</span>
                              {isDisabled && <span className="ml-auto text-xs bg-gray-200 px-1.5 py-0.5 rounded">Lock</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};