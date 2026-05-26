# MSW (Mock Service Worker) 사용 가이드

MSW는 Service Worker를 이용하여 브라우저에서 네트워크 요청을 인터셉트합니다.  
백엔드 없이 프론트엔드를 개발하거나 테스트할 수 있습니다.

## 목차

- [동작 원리](#동작-원리)
- [시작하기](#시작하기)
- [핸들러 작성법](#핸들러-작성법)
- [목 데이터 관리](#목-데이터-관리)
- [특정 테스트에서 핸들러 덮어쓰기](#특정-테스트에서-핸들러-덮어쓰기)
- [자주 묻는 질문](#자주-묻는-질문)

---

## 동작 원리

```
개발 환경 (pnpm mock)
  └── 브라우저 Service Worker
        └── 네트워크 요청 인터셉트
              └── src/mocks/handlers/*.ts 응답 반환

테스트 환경 (pnpm test)
  └── Node.js 인터셉터 (msw/node)
        └── fetch 요청 인터셉트
              └── 동일한 handlers/*.ts 재사용 → 일관성 보장
```

---

## 시작하기

### 개발 서버 실행 (MSW 활성화)

```bash
pnpm mock
```

> `pnpm dev` 대신 `pnpm mock`을 사용하면 MSW가 활성화됩니다.  
> 브라우저 콘솔에서 `[MSW] Mocking enabled` 메시지를 확인할 수 있습니다.

### 파일 구조

```
src/mocks/
├── handlers/
│   ├── index.ts         ← 핸들러 통합 진입점
│   └── example.ts       ← 예시 핸들러 (수정/삭제 가능)
├── data/
│   └── example.ts       ← 목 데이터
├── browser.ts           ← 브라우저용 worker 설정
└── server.ts            ← Node(테스트)용 server 설정
```

---

## 핸들러 작성법

### 기본 패턴

```typescript
// src/mocks/handlers/user.ts
import { http, HttpResponse } from 'msw'

export const userHandlers = [
  // GET 요청
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: '1', name: '홍길동' }])
  }),

  // POST 요청 (요청 본문 파싱)
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '2', ...body }, { status: 201 })
  }),

  // URL 파라미터
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: '홍길동' })
  }),

  // 에러 응답
  http.delete('/api/users/:id', ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
```

### 핸들러 등록

```typescript
// src/mocks/handlers/index.ts
import { exampleHandlers } from './example'
import { userHandlers } from './user'  // 새로 추가

export const handlers = [
  ...exampleHandlers,
  ...userHandlers,  // 여기에 추가
]
```

### 지연 응답 (네트워크 지연 시뮬레이션)

```typescript
import { delay, http, HttpResponse } from 'msw'

http.get('/api/slow-endpoint', async () => {
  await delay(2000)  // 2초 지연
  return HttpResponse.json({ data: '느린 응답' })
})
```

### 네트워크 에러 시뮬레이션

```typescript
import { http, HttpResponse } from 'msw'

http.get('/api/users', () => {
  return HttpResponse.error()  // 네트워크 에러
})
```

---

## 목 데이터 관리

`src/mocks/data/` 디렉토리에 도메인별로 목 데이터를 분리하여 관리합니다.

```typescript
// src/mocks/data/user.ts
export const users = [
  { id: '1', name: '홍길동', email: 'hong@example.com' },
  { id: '2', name: '김철수', email: 'kim@example.com' },
]

// 핸들러에서 사용
import { users } from '@/mocks/data/user'

http.get('/api/users', () => {
  return HttpResponse.json(users)
})
```

> **Tip**: 대량의 목 데이터가 필요하다면 [@faker-js/faker](https://fakerjs.dev/)를 사용하세요.

---

## 특정 테스트에서 핸들러 덮어쓰기

특정 테스트에서만 다른 응답을 반환해야 할 때 `server.use()`로 핸들러를 임시로 덮어쓸 수 있습니다.

```typescript
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

it('에러 상태를 테스트합니다', async () => {
  // 이 테스트에서만 에러 반환 (afterEach에서 자동으로 리셋됨)
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({ message: 'Server Error' }, { status: 500 })
    })
  )

  // 테스트 코드...
})
```

> `afterEach(() => server.resetHandlers())`가 `src/__tests__/setup.ts`에 설정되어 있어  
> 각 테스트 후 자동으로 원래 핸들러로 복원됩니다.

---

## 자주 묻는 질문

**Q. `pnpm dev`와 `pnpm mock`의 차이는?**  
A. `pnpm mock`은 `NEXT_PUBLIC_MSW_ENABLED=true` 환경변수를 설정하여 MSW를 활성화합니다.  
`pnpm dev`는 MSW 없이 실제 API 서버에 요청합니다.

**Q. 특정 API만 MSW로 처리하고 나머지는 실제 서버로 보내려면?**  
A. `onUnhandledRequest: 'bypass'` 설정이 이미 되어 있어, 핸들러가 없는 요청은 자동으로 실제 서버로 전달됩니다.

**Q. MSW가 활성화됐는지 확인하는 방법은?**  
A. 브라우저 개발자 도구 콘솔에서 `[MSW] Mocking enabled.` 메시지를 확인하세요.  
Application 탭 → Service Workers에서도 확인할 수 있습니다.
