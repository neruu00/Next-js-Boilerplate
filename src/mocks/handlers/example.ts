/**
 * MSW 핸들러 예시
 *
 * REST API 요청을 인터셉트하고 목업 응답을 반환합니다.
 * 실제 API 경로와 동일하게 작성하세요.
 *
 * @see https://mswjs.io/docs/basics/request-handler
 */

import { http, HttpResponse } from 'msw';

import { posts, users } from '@/mocks/data/example';

export const exampleHandlers = [
  // ────────────────────────────────────────────────────────────
  // Users
  // ────────────────────────────────────────────────────────────

  /** GET /api/users — 전체 사용자 목록 */
  http.get('/api/users', () => {
    return HttpResponse.json(users);
  }),

  /** GET /api/users/:id — 특정 사용자 조회 */
  http.get('/api/users/:id', ({ params }) => {
    const user = users.find((u) => u.id === params.id);

    if (!user) {
      return HttpResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  /** POST /api/users — 사용자 생성 */
  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string };

    const newUser = {
      id: String(users.length + 1),
      name: body.name,
      email: body.email,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    // 실제 DB 저장은 하지 않고 응답만 반환
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // ────────────────────────────────────────────────────────────
  // Posts
  // ────────────────────────────────────────────────────────────

  /** GET /api/posts — 전체 게시글 목록 */
  http.get('/api/posts', () => {
    return HttpResponse.json(posts);
  }),

  /** GET /api/posts/:id — 특정 게시글 조회 */
  http.get('/api/posts/:id', ({ params }) => {
    const post = posts.find((p) => p.id === params.id);

    if (!post) {
      return HttpResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),
];
