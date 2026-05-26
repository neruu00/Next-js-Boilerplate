/**
 * MSW Node.js 서버 설정
 *
 * 테스트 환경(Vitest)에서 Node.js 인터셉터를 통해 네트워크 요청을 인터셉트합니다.
 * 브라우저 핸들러와 동일한 handlers를 재사용하므로 일관성이 보장됩니다.
 *
 * @see https://mswjs.io/docs/integrations/node
 */

import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
