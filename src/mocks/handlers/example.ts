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

  /** POST /api/users — 사용자 생성 (JSON 및 FormData 지원) */
  http.post('/api/users', async ({ request }) => {
    // Content-Type 확인
    const contentType = request.headers.get('content-type') || '';
    
    let name = '';
    let email = '';
    let bio = '';

    if (contentType.includes('multipart/form-data')) {
      // 1. Form Data 파싱
      const formData = await request.formData();
      name = formData.get('name')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      bio = formData.get('bio')?.toString() || '';
    } else {
      // 2. JSON 파싱
      const body = (await request.json()) as any;
      name = body.name || '';
      email = body.email || '';
      bio = body.bio || '';
    }

    if (!name || !email) {
      return HttpResponse.json({ message: '이름과 이메일은 필수입니다.' }, { status: 400 });
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      bio,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /** PATCH /api/users/:id — 사용자 정보 수정 */
  http.patch('/api/users/:id', async ({ request, params }) => {
    const { id } = params;
    const body = (await request.json()) as any;

    if (id === '999') {
      return HttpResponse.json({ message: '수정할 수 없는 사용자입니다.' }, { status: 403 });
    }

    return HttpResponse.json({
      message: `${id}번 사용자 정보가 성공적으로 수정되었습니다.`,
      updatedFields: body
    });
  }),

  /** DELETE /api/users/:id — 사용자 삭제 */
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    
    if (id === '999') {
      return HttpResponse.json({ message: '삭제할 수 없는 사용자입니다.' }, { status: 403 });
    }

    return HttpResponse.json({
      message: `${id}번 사용자가 삭제되었습니다.`
    });
  }),

  // ────────────────────────────────────────────────────────────
  // Posts
  // ────────────────────────────────────────────────────────────

  /** GET /api/posts — 전체 게시글 목록 (Query Parameter 파싱 예시) */
  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const limit = url.searchParams.get('limit');

    // 쿼리 파라미터가 있을 경우 메타데이터와 함께 반환
    if (page || limit) {
      return HttpResponse.json({
        data: posts.slice(0, Number(limit) || 10),
        meta: {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          total: posts.length,
          message: '쿼리 파라미터에 따라 필터링된 결과입니다.'
        }
      });
    }

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
