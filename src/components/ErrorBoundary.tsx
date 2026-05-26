'use client';

/**
 * 에러 바운더리 컴포넌트
 *
 * 하위 컴포넌트에서 발생하는 런타임 에러를 캐치하고 폴백 UI를 표시합니다.
 * react-error-boundary 라이브러리를 기반으로 합니다.
 *
 * 사용법:
 * ```tsx
 * // 전역 에러 처리 (layout.tsx)
 * <ErrorBoundary>
 *   {children}
 * </ErrorBoundary>
 *
 * // 로컬 에러 처리 (특정 컴포넌트)
 * <ErrorBoundary fallback={<div>이 섹션을 불러올 수 없습니다.</div>}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 *
 * // 에러 초기화
 * <ErrorBoundary onReset={() => refetch()}>
 *   <DataComponent />
 * </ErrorBoundary>
 * ```
 *
 * @see https://github.com/bvaughn/react-error-boundary
 */

import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';

/** 라이브러리의 FallbackProps를 직접 사용하여 타입 일치 보장 */
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
    >
      <div className="text-4xl">⚠️</div>
      <div>
        <h2 className="mb-1 text-lg font-semibold text-red-800">문제가 발생했습니다</h2>
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        다시 시도
      </button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** 커스텀 정적 폴백 UI (ReactNode). 에러 정보/재시도 버튼 불필요 시 사용 */
  fallback?: React.ReactNode;
  onReset?: () => void;
  onError?: (error: unknown, info: React.ErrorInfo) => void;
}

export default function ErrorBoundary({
  children,
  fallback,
  onReset,
  onError,
}: ErrorBoundaryProps) {
  /** fallback ReactNode가 있으면 정적 UI 표시, 없으면 기본 DefaultFallback 사용
   *  두 prop을 동시에 전달하면 타입 충돌이 발생하므로 분기 처리 */
  if (fallback) {
    return (
      <ReactErrorBoundary fallback={fallback} onReset={onReset} onError={onError}>
        {children}
      </ReactErrorBoundary>
    );
  }

  return (
    <ReactErrorBoundary FallbackComponent={DefaultFallback} onReset={onReset} onError={onError}>
      {children}
    </ReactErrorBoundary>
  );
}
