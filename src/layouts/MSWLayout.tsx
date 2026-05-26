'use client';

/**
 * MSW 초기화 레이아웃 컴포넌트
 *
 * NEXT_PUBLIC_MSW_ENABLED=true 환경변수가 설정된 경우에만 MSW를 활성화합니다.
 * `pnpm mock` 스크립트로 개발 서버를 실행할 때 자동으로 동작합니다.
 *
 * 동작 방식:
 * - 브라우저 환경에서 Service Worker를 등록
 * - 등록 완료 전까지 children 렌더링을 지연 (선택적)
 * - onUnhandledRequest: 'bypass' — 핸들러 없는 요청은 실제 서버로 전달
 */

import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const isMSWEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

async function enableMocking() {
  if (!isMSWEnabled) return;
  if (typeof window === 'undefined') return;

  const { worker } = await import('@/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

export default function MSWLayout({ children }: Props) {
  const [isReady, setIsReady] = useState(!isMSWEnabled);

  useEffect(() => {
    enableMocking().then(() => setIsReady(true));
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
