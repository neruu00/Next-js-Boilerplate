import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <main className="w-full max-w-5xl flex flex-col items-center text-center gap-10">
        
        {/* 헤더 섹션 */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Production Ready
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            Next.js <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Boilerplate</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            최신 웹 개발을 위한 최적의 도구들이 통합된 스타터 템플릿입니다.<br className="hidden sm:block" />
            백엔드 없이도 즉시 프론트엔드 개발을 시작할 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/playground"
            className="flex-1 sm:flex-none items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/30"
          >
            API Playground
          </Link>
          <a
            href="https://github.com/neruu00/Next-js-Boilerplate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            GitHub
          </a>
        </div>
        
      </main>
    </div>
  );
}