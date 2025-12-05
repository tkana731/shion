import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          Shion
          <span className="block text-lg font-normal text-gray-600 mt-2">
            シオン - 推しへの想いを、記録に残そう
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
          推し活と日常生活の支出を一元管理。
          <br />
          「推しにいくら使ったか」を可視化しつつ、一般的な家計管理も行える、オタク向け家計簿アプリ
        </p>

        <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-purple-600 px-8 text-base font-semibold text-white transition-colors hover:bg-purple-500 sm:w-auto"
          >
            無料で始める
          </Link>
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg border-2 border-purple-600 px-8 text-base font-semibold text-purple-600 transition-colors hover:bg-purple-50 sm:w-auto"
          >
            ログイン
          </Link>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 flex justify-center">
              <svg
                className="h-10 w-10 text-pink-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              推し別の支出管理
            </h3>
            <p className="text-sm text-gray-600">
              どの推しにいくら使ったか一目で分かる
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 flex justify-center">
              <svg
                className="h-10 w-10 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              定期支出の自動化
            </h3>
            <p className="text-sm text-gray-600">
              毎月の固定費を自動的に表示に反映
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-3 flex justify-center">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              柔軟なタグ機能
            </h3>
            <p className="text-sm text-gray-600">
              支出に複数タグを付与して多角的に分析
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
