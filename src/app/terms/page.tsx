import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 py-12 max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="text-blue-400 text-sm hover:underline mb-8 inline-block"
        >
          &larr; トップに戻る
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">利用規約</h1>

        <div className="text-white/70 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-white font-semibold mb-2">1. サービスの目的</h2>
            <p>
              SnapEnglish（以下「本サービス」）は、英語学習を支援する個人向けツールです。
              入力された英文に対し、AIによる和訳と文構造解析を提供します。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. 利用条件</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスは個人の学習目的でのみ利用してください。</li>
              <li>解析結果を転載・配布・商用利用しないでください。</li>
              <li>利用権限のある文章のみを入力してください。</li>
              <li>1回の入力は1〜3文程度にとどめてください。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. 著作権について</h2>
            <p>
              本サービスは入力された英文の翻訳・構造解析を行う学習補助ツールです。
              教材や書籍の代替を意図するものではありません。
              入力は1回あたり数文に制限されており、大量のテキストを処理する機能はありません。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. データの取り扱い</h2>
            <p>
              入力された画像・テキスト・解析結果はサーバーに保存されません。
              AIによる処理完了後、直ちに破棄されます。
              詳しくは<Link href="/privacy" className="text-blue-400 hover:underline">プライバシーポリシー</Link>をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">5. 免責事項</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>AIによる翻訳・解析結果の正確性は保証しません。</li>
              <li>本サービスの利用により生じた損害について責任を負いません。</li>
              <li>サービスの提供を予告なく中断・終了する場合があります。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">6. 規約の変更</h2>
            <p>
              本規約は予告なく変更される場合があります。
              変更後の規約は本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <p className="text-white/40 text-xs pt-4">最終更新日: 2026年2月21日</p>
        </div>
      </main>
    </div>
  );
}
