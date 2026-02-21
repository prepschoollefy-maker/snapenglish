import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 py-12 max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="text-blue-400 text-sm hover:underline mb-8 inline-block"
        >
          &larr; トップに戻る
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">プライバシーポリシー</h1>

        <div className="text-white/70 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-white font-semibold mb-2">1. 収集する情報</h2>
            <p>
              本サービスは、ユーザーの個人情報を収集・保存しません。
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>アカウント登録は不要です。</li>
              <li>入力された画像・テキストはサーバーに保存されません。</li>
              <li>解析結果はサーバーに保存されません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. データの処理フロー</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>ユーザーが画像またはテキストを送信します。</li>
              <li>サーバーがAI（Google Gemini）に転送し、解析結果を取得します。</li>
              <li>結果をユーザーに返却後、サーバー上のデータは直ちに破棄されます。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. ローカルストレージ</h2>
            <p>
              解析結果の履歴はブラウザのローカルストレージに保存されます。
              これはユーザーの端末内にのみ存在し、サーバーには送信されません。
              ブラウザの設定からいつでも削除できます。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. 第三者サービス</h2>
            <p>
              本サービスは以下の第三者サービスを利用しています。
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Google Gemini API（テキスト解析処理）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
            <p className="mt-2">
              これらのサービスにおけるデータの取り扱いは、各サービスのプライバシーポリシーに準じます。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">5. 共有機能</h2>
            <p>
              本サービスに共有機能はありません。
              解析結果を他のユーザーと共有する手段は提供していません。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">6. お問い合わせ</h2>
            <p>
              本ポリシーに関するお問い合わせは
              <Link href="/contact" className="text-blue-400 hover:underline">お問い合わせページ</Link>
              からご連絡ください。
            </p>
          </section>

          <p className="text-white/40 text-xs pt-4">最終更新日: 2026年2月21日</p>
        </div>
      </main>
    </div>
  );
}
