/**
 * 환경변수 타입 검증
 *
 * Zod를 사용하여 환경변수를 런타임에 검증합니다.
 * 필수 환경변수가 없거나 잘못된 경우 애플리케이션 시작 시 즉시 에러를 발생시킵니다.
 *
 * 사용법:
 * ```ts
 * import { env } from '@/lib/env'
 * console.log(env.NEXT_PUBLIC_API_URL)
 * ```
 *
 * 새로운 환경변수 추가 시:
 * 1. 이 파일의 envSchema에 필드 추가
 * 2. .env.example에 예시 값 추가
 * 3. .env.local에 실제 값 추가
 */

import { z } from 'zod';

const envSchema = z.object({
  /** API 베이스 URL */
  NEXT_PUBLIC_API_URL: z.string().min(1).default('http://localhost:3000/api'),

  /** MSW 활성화 여부 (pnpm mock 스크립트에서 자동 설정) */
  NEXT_PUBLIC_MSW_ENABLED: z.enum(['true', 'false']).default('false'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MSW_ENABLED: process.env.NEXT_PUBLIC_MSW_ENABLED,
});

if (!parsed.success) {
  console.error('❌ 환경변수 검증 실패:', parsed.error.flatten().fieldErrors);
  throw new Error('유효하지 않은 환경변수가 있습니다. .env.example을 참고하세요.');
}

export const env = parsed.data;
