/**
 * 예시 API 서비스
 *
 * TanStack Query의 queryFn에서 사용할 API 호출 함수를 정의합니다.
 * 도메인별로 파일을 분리하여 관리하세요.
 *
 * 사용 예시:
 * ```ts
 * import { userService } from '@/services'
 *
 * // TanStack Query와 함께 사용
 * const { data } = useQuery({
 *   queryKey: ['users'],
 *   queryFn: userService.getAll,
 * })
 * ```
 */

import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

// ────────────────────────────────────────────────────────────
// User Service
// ────────────────────────────────────────────────────────────

export const userService = {
  /** 전체 사용자 목록 조회 */
  getAll: () => api.get('users').json<User[]>(),

  /** 특정 사용자 조회 */
  getById: (id: string) => api.get(`users/${id}`).json<User>(),

  /** 사용자 생성 */
  create: (input: CreateUserInput) =>
    api.post('users', { json: input }).json<User>(),

  /** 사용자 수정 */
  update: (id: string, input: Partial<CreateUserInput>) =>
    api.patch(`users/${id}`, { json: input }).json<User>(),

  /** 사용자 삭제 */
  delete: (id: string) => api.delete(`users/${id}`).json<void>(),
};

// ────────────────────────────────────────────────────────────
// Post Service
// ────────────────────────────────────────────────────────────

export const postService = {
  /** 전체 게시글 목록 조회 */
  getAll: () => api.get('posts').json<Post[]>(),

  /** 특정 게시글 조회 */
  getById: (id: string) => api.get(`posts/${id}`).json<Post>(),
};
