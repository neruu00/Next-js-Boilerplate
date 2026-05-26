/**
 * 컴포넌트 테스트 예시 (MSW + Testing Library)
 *
 * MSW 핸들러를 사용해 API 요청을 목업하고
 * 컴포넌트의 렌더링 동작을 테스트합니다.
 *
 * `pnpm test` 로 실행
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import React, { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { server } from '@/mocks/server';

// ────────────────────────────────────────────────────────────
// 테스트용 래퍼
// ────────────────────────────────────────────────────────────

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

// ────────────────────────────────────────────────────────────
// 테스트할 간단한 컴포넌트 (예시)
// ────────────────────────────────────────────────────────────

function UserCount() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('API 오류');
        return res.json();
      })
      .then((data: unknown[]) => setCount(data.length))
      .catch(() => setError('불러오기 실패'));
  }, []);

  if (error) return <div role="alert">{error}</div>;
  if (count === null) return <div>로딩 중...</div>;
  return <div>사용자 수: {count}명</div>;
}

// ────────────────────────────────────────────────────────────
// 테스트 케이스
// ────────────────────────────────────────────────────────────

describe('MSW + Testing Library 통합 테스트 예시', () => {
  it('API 데이터를 받아서 렌더링합니다', async () => {
    render(
      <TestWrapper>
        <UserCount />
      </TestWrapper>,
    );

    // 로딩 상태 확인
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();

    // 데이터 로드 후 확인 (MSW가 /api/users를 핸들링)
    await waitFor(() => {
      expect(screen.getByText('사용자 수: 3명')).toBeInTheDocument();
    });
  });

  it('API 에러 시 에러 메시지를 표시합니다', async () => {
    // 이 테스트에서만 500 에러 반환 (afterEach에서 자동으로 리셋됨)
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }),
    );

    render(
      <TestWrapper>
        <UserCount />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('불러오기 실패');
    });
  });
});
