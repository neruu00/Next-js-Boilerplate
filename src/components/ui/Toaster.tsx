/**
 * Toast 알림 컴포넌트 (sonner)
 *
 * 전역 레이아웃(layout.tsx)에 한 번만 추가하면 어디서든 사용 가능합니다.
 *
 * 사용법:
 * ```ts
 * import { toast } from 'sonner'
 *
 * toast.success('저장되었습니다.')
 * toast.error('오류가 발생했습니다.')
 * toast.info('알림 메시지')
 * toast.warning('주의 메시지')
 * toast.loading('처리 중...') // Promise와 함께 사용
 *
 * // Promise 기반 (API 요청 상태 표시)
 * toast.promise(saveData(), {
 *   loading: '저장 중...',
 *   success: '저장 완료!',
 *   error: '저장 실패',
 * })
 * ```
 *
 * @see https://sonner.emilkowal.ski/
 */

import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      duration={3000}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  );
}
