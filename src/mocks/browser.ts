/**
 * MSW 브라우저 설정
 *
 * 브라우저 환경(개발 서버)에서 Service Worker를 통해 네트워크 요청을 인터셉트합니다.
 * `pnpm mock` 스크립트로 실행 시 자동으로 활성화됩니다.
 *
 * @see https://mswjs.io/docs/integrations/browser
 */

import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
