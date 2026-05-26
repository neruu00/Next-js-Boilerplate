/**
 * Vitest 전역 테스트 설정
 *
 * 모든 테스트 파일 실행 전에 자동으로 실행됩니다.
 * - @testing-library/jest-dom 매처 등록
 * - MSW 서버 라이프사이클 관리
 */

import '@testing-library/jest-dom';

import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/mocks/server';

/**
 * MSW 서버 라이프사이클
 *
 * beforeAll: 테스트 스위트 시작 전 서버 시작
 * afterEach: 각 테스트 후 핸들러 초기화 (테스트 간 격리)
 * afterAll: 테스트 스위트 종료 후 서버 종료
 */
beforeAll(() =>
  server.listen({
    /** 핸들러 없는 요청을 에러로 처리 (실수 방지) */
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
