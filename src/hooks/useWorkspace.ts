import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// データ型の定義
export type PlanType = 'free' | 'pro' | 'team';
export type SnsPlatform = 'youtube' | 'tiktok' | 'instagram' | 'x';

export interface Team {
  id: string;
  name: string;
  plan_type: PlanType;
}

export interface SnsAccount {
  id: string;
  platform: SnsPlatform;
  account_name: string;
}

export const useWorkspace = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [snsAccounts, setSnsAccounts] = useState<SnsAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // データの取得（なければ自動作成）
  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. 自分が所属するチームを探す
      const { data: myMemberships } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      let currentTeamId = myMemberships?.[0]?.team_id;

      // 2. チームがまだない場合（初回）は、自動で「個人チーム」を作成する
      if (!currentTeamId) {
        console.log('チームが存在しないため、新規作成します...');
        
        // チーム作成
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert([{ name: `${user.email?.split('@')[0]}'s Workspace`, plan_type: 'free' }])
          .select()
          .single();
        
        if (teamError) throw teamError;

        // メンバーとして紐付け
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([{ team_id: newTeam.id, user_id: user.id, role: 'owner' }]);

        if (memberError) throw memberError;

        currentTeamId = newTeam.id;
      }

      // 3. チーム情報の詳細を取得
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', currentTeamId)
        .single();
      
      setTeam(teamData);

      // 4. SNS連携情報を取得
      const { data: snsData } = await supabase
        .from('sns_accounts')
        .select('*')
        .eq('team_id', currentTeamId);
      
      setSnsAccounts(snsData || []);

    } catch (error) {
      console.error('Workspace Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // SNSアカウントを追加する関数（モック）
  const addSnsAccount = async (platform: SnsPlatform, accountName: string) => {
    if (!team) return;
    
    // ここで本来はOAuth認証などが入りますが、一旦直接追加します
    const { error } = await supabase.from('sns_accounts').insert([
      {
        team_id: team.id,
        platform,
        account_name: accountName,
      }
    ]);

    if (error) {
      alert('追加エラー: ' + error.message);
    } else {
      fetchWorkspace(); // リストを再取得
    }
  };

  // 初回実行
  useEffect(() => {
    fetchWorkspace();
  }, []);

  return { team, snsAccounts, loading, addSnsAccount, refresh: fetchWorkspace };
};