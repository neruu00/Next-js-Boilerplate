'use client';

import React, { useState } from 'react';
import { ApiPanel, type ApiConfig } from './_components/ApiPanel';

// ────────────────────────────────────────────────────────────
// 도메인별 API 목록 (Swagger 스타일)
// ────────────────────────────────────────────────────────────

const USERS_API: ApiConfig[] = [
  {
    name: '전체 사용자 조회',
    path: '/api/users',
    method: 'GET',
  },
  {
    name: '특정 사용자 조회',
    path: '/api/users/:id',
    method: 'GET',
    pathParams: [
      { name: 'id', placeholder: 'ID (예: 1)', nullable: false }
    ],
  },
  {
    name: '새 사용자 생성',
    path: '/api/users',
    method: 'POST',
    bodyType: 'json',
    bodyParams: [
      { name: 'name', placeholder: '이름', nullable: false },
      { name: 'email', placeholder: '이메일', nullable: false },
      { name: 'bio', placeholder: '자기소개', nullable: true }
    ],
  },
  {
    name: '사용자 정보 수정',
    path: '/api/users/:id',
    method: 'PATCH',
    pathParams: [
      { name: 'id', placeholder: 'ID (예: 1)', nullable: false }
    ],
    bodyParams: [
      { name: 'name', placeholder: '변경할 이름', nullable: true }
    ],
  },
  {
    name: '사용자 삭제',
    path: '/api/users/:id',
    method: 'DELETE',
    pathParams: [
      { name: 'id', placeholder: 'ID (예: 1)', nullable: false }
    ],
  },
];

const POSTS_API: ApiConfig[] = [
  {
    name: '전체 게시글 조회',
    path: '/api/posts',
    method: 'GET',
    queryParams: [
      { name: 'page', placeholder: '페이지 번호', nullable: true },
      { name: 'limit', placeholder: '개수 (예: 10)', nullable: true }
    ],
  },
  {
    name: '특정 게시글 조회',
    path: '/api/posts/:id',
    method: 'GET',
    pathParams: [
      { name: 'id', placeholder: '게시글 ID (예: 1)', nullable: false }
    ],
  },
];

export default function PlaygroundPage() {
  const [result, setResult] = useState<string>('결과가 여기에 표시됩니다.');

  return (
    <div className="p-8 font-sans">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">API Playground 🧪</h1>
        <a href="/" className="text-blue-500 hover:underline mb-8 block">&larr; 홈으로</a>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 컨트롤 패널 (좌측) */}
          <div className="flex flex-col gap-10 lg:w-1/2 lg:pr-4">
            {/* 도메인(엔티티) 단위로 그룹화된 패널을 렌더링합니다. */}
            <ApiPanel title="Users API" apis={USERS_API} onResult={setResult} />
            <ApiPanel title="Posts API" apis={POSTS_API} onResult={setResult} />
          </div>

          {/* 결과 패널 (우측) */}
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <div className="font-bold mb-2">응답 결과</div>
              <pre className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-4 rounded-xl min-h-[400px] max-h-[85vh] overflow-auto whitespace-pre-wrap text-sm shadow-inner">
                {result}
              </pre>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
