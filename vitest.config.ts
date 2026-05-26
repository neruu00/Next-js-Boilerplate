/**
 * Vitest 설정
 *
 * @see https://vitest.dev/config/
 */

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    /** jsdom으로 브라우저 환경 시뮬레이션 */
    environment: 'jsdom',

    /** 테스트 전 실행할 설정 파일 */
    setupFiles: ['./src/__tests__/setup.ts'],

    /** describe, it, expect 등을 import 없이 전역에서 사용 가능 */
    globals: true,

    /** Playwright E2E 테스트 파일 제외 */
    exclude: ['node_modules', 'e2e/**'],

    /** 커버리지 설정 */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        'src/mocks/**',
        '*.config.*',
        'e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      /** @/* 절대경로 별칭 (tsconfig와 동일) */
      '@': path.resolve(__dirname, './src'),
    },
  },
});
