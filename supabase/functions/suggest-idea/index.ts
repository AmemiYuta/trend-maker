// Denoの型定義をインポート
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ★修正1: req に ': Request' という型を明記してエラーを解消
Deno.serve(async (req: Request) => {
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, category } = await req.json()
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!title) throw new Error('タイトルが必要です')

    // OpenAIへのリクエスト
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `あなたはSNS動画のプロの放送作家です。
            ユーザーから提供された「動画タイトル」と「ジャンル」を元に、魅力的な動画構成案を作成してください。
            
            必ず以下のJSON形式のみを返してください（余計な文章は不要）。
            
            {
              "reason": "この企画が伸びる理由や狙い（50文字以内）",
              "difficulty": "易/中/難 のいずれか",
              "time": "想定尺（例: 30秒）",
              "tags": ["#タグ1", "#タグ2", "#タグ3"],
              "structure": [
                {"time": "0-5秒", "label": "フック", "content": "具体的な映像内容", "memo": "撮影のポイント"},
                {"time": "5-20秒", "label": "展開", "content": "具体的な映像内容", "memo": "撮影のポイント"},
                {"time": "20-30秒", "label": "オチ", "content": "具体的な映像内容", "memo": "撮影のポイント"}
              ]
            }`
          },
          {
            role: 'user',
            content: `タイトル: ${title}\nジャンル: ${category}`
          }
        ]
      }),
    })

    const data = await response.json()
    let aiContent = data.choices[0].message.content
    
    // ★修正2: GPTが「```json ... ```」というコードブロックを含めて返してくる場合の対策
    // これがないと、JSON.parse() でエラーになることがよくあります
    aiContent = aiContent.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();

    // JSON文字列をオブジェクトに変換
    const result = JSON.parse(aiContent)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    // ★修正3: error の型チェックを追加（'unknown' エラーの解消）
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})