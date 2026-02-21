import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 py-12 max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="text-blue-400 text-sm hover:underline mb-8 inline-block"
        >
          &larr; トップに戻る
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">お問い合わせ</h1>

        <div className="text-white/70 text-sm leading-relaxed space-y-6">
          <section>
            <p>
              SnapEnglish に関するお問い合わせ、著作権に関するご連絡は、
              以下の方法でお願いいたします。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">GitHub</h2>
            <p>
              <a
                href="https://github.com/prepschoollefy-maker/snapenglish/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                https://github.com/prepschoollefy-maker/snapenglish/issues
              </a>
            </p>
            <p className="mt-1 text-white/50">
              Issue を作成してご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">著作権者の方へ</h2>
            <p>
              本サービスに関して著作権上の懸念がある場合は、上記の GitHub Issues
              よりご連絡ください。速やかに対応いたします。
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">本サービスについて</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>個人の英語学習を支援する非営利ツールです。</li>
              <li>入力データはサーバーに保存しません。</li>
              <li>1回の解析は数文に制限しています。</li>
              <li>教材や書籍の代替を意図するものではありません。</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
