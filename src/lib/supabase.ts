import { createClient } from '@supabase/supabase-js';

// 環境変数の読み込み
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ★ここが重要！ 'export' が必要です
export const supabase = createClient(supabaseUrl, supabaseKey);