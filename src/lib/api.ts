/**
 * HTTP 클라이언트 (ky 기반)
 *
 * ky는 fetch API 기반의 경량 HTTP 클라이언트입니다.
 * 인터셉터, 자동 재시도, 타임아웃, JSON 파싱 등을 지원합니다.
 *
 * @see https://github.com/sindresorhus/ky
 *
 * 사용 방법:
 * ```ts
 * import { api } from '@/lib/api'
 *
 * // GET
 * const users = await api.get('users').json<User[]>()
 *
 * // POST
 * const newUser = await api.post('users', { json: { name: '홍길동' } }).json<User>()
 * ```
 */

import ky, { HTTPError, type Options } from 'ky';

import { env } from './env';

/** 인증 토큰을 가져오는 함수 (zustand store 또는 localStorage에서) */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

const defaultOptions: Options = {
  prefix: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 429, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAuthToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ response }) => {
        // 401 Unauthorized: 토큰 만료 처리
        if (response.status === 401) {
          // 토큰 갱신 로직 또는 로그아웃 처리
          // 예: window.location.href = '/login'
          console.warn('[API] 인증이 만료되었습니다.');
        }
        return response;
      },
    ],
    beforeError: [
      ({ error }) => {
        // 공통 에러 처리 로직 (Sentry 등)
        // console.error 등 콘솔 출력은 제거됨
        return error;
      },
    ],
  },
};

/** 기본 API 클라이언트 */
export const api = ky.create(defaultOptions);

/**
 * 인증 없는 공개 API 클라이언트
 * 로그인, 회원가입 등 인증 헤더가 필요 없는 요청에 사용
 */
export const publicApi = ky.create({
  ...defaultOptions,
  hooks: {
    ...defaultOptions.hooks,
    beforeRequest: [],
  },
});
