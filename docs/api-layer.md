# API 레이어 가이드

이 프로젝트는 `ky` 기반 HTTP 클라이언트와 서비스 레이어 패턴을 사용합니다.

## 목차

- [구조 개요](#구조-개요)
- [API 클라이언트 (lib/api.ts)](#api-클라이언트-libapiTs)
- [서비스 레이어 (services/)](#서비스-레이어-services)
- [TanStack Query와 함께 사용](#tanstack-query와-함께-사용)
- [환경변수 설정](#환경변수-설정)
- [에러 처리](#에러-처리)
- [인증 토큰 관리](#인증-토큰-관리)

---

## 구조 개요

```
API 요청 흐름:

컴포넌트 (useQuery/useMutation)
  └── services/*.service.ts   ← API 함수 정의
        └── lib/api.ts        ← ky 클라이언트 (인터셉터, 에러 처리)
              └── MSW / 실제 서버
```

---

## API 클라이언트 (lib/api.ts)

`ky`는 fetch API 기반의 경량 HTTP 클라이언트로, 인터셉터와 자동 재시도를 지원합니다.

### 기본 사용법

```typescript
import { api } from '@/lib/api'

// GET
const users = await api.get('users').json<User[]>()

// POST
const newUser = await api.post('users', {
  json: { name: '홍길동', email: 'hong@example.com' }
}).json<User>()

// PATCH
const updated = await api.patch(`users/${id}`, {
  json: { name: '새 이름' }
}).json<User>()

// DELETE
await api.delete(`users/${id}`)
```

> **주의**: `prefixUrl`이 설정되어 있어 경로는 `/`로 시작하지 않습니다.  
> `api.get('users')` → `GET ${NEXT_PUBLIC_API_URL}/users`

### 인증 없는 공개 API

로그인, 회원가입 등 토큰이 필요 없는 요청은 `publicApi`를 사용합니다.

```typescript
import { publicApi } from '@/lib/api'

const result = await publicApi.post('auth/login', {
  json: { email, password }
}).json<LoginResponse>()
```

### 쿼리 파라미터

```typescript
import { api } from '@/lib/api'

const users = await api.get('users', {
  searchParams: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
  }
}).json<User[]>()
// → GET /api/users?page=1&limit=10&sort=createdAt
```

---

## 서비스 레이어 (services/)

API 호출 함수를 도메인별로 분리하여 재사용성과 테스트 가능성을 높입니다.

### 새 서비스 파일 생성

```typescript
// src/services/product.service.ts
import { api } from '@/lib/api'

export interface Product {
  id: string
  name: string
  price: number
}

export const productService = {
  getAll: () => api.get('products').json<Product[]>(),

  getById: (id: string) =>
    api.get(`products/${id}`).json<Product>(),

  create: (input: Omit<Product, 'id'>) =>
    api.post('products', { json: input }).json<Product>(),

  update: (id: string, input: Partial<Product>) =>
    api.patch(`products/${id}`, { json: input }).json<Product>(),

  delete: (id: string) =>
    api.delete(`products/${id}`).json<void>(),
}
```

### 서비스 export 등록

```typescript
// src/services/index.ts
export * from './example.service'
export * from './product.service'  // 추가
```

---

## TanStack Query와 함께 사용

서비스 함수를 TanStack Query의 `queryFn` / `mutationFn`에 연결합니다.

### useQuery (데이터 조회)

```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 1000 * 60 * 5,  // 5분
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,  // id가 있을 때만 실행
  })
}
```

### useMutation (데이터 변경)

```typescript
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '@/services'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      // 사용자 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('사용자가 생성되었습니다.')
    },
    onError: () => {
      toast.error('사용자 생성에 실패했습니다.')
    },
  })
}
```

### 컴포넌트에서 사용

```tsx
function UserList() {
  const { data: users, isLoading, isError } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>오류가 발생했습니다.</div>

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button
        onClick={() => createUser.mutate({ name: '새 사용자', email: 'new@example.com' })}
        disabled={createUser.isPending}
      >
        {createUser.isPending ? '생성 중...' : '사용자 추가'}
      </button>
    </div>
  )
}
```

---

## 환경변수 설정

`.env.local` 파일에서 API URL을 설정합니다.

```bash
# 실제 백엔드 서버
NEXT_PUBLIC_API_URL="https://api.myproject.com"

# 로컬 개발 서버
NEXT_PUBLIC_API_URL="http://localhost:8080/api"

# MSW 사용 시 (pnpm mock)
NEXT_PUBLIC_MSW_ENABLED="true"
```

`src/lib/env.ts`를 통해 타입 안전하게 환경변수에 접근합니다.

```typescript
import { env } from '@/lib/env'

console.log(env.NEXT_PUBLIC_API_URL)  // string
console.log(env.NEXT_PUBLIC_MSW_ENABLED)  // 'true' | 'false'
```

---

## 에러 처리

### 전역 에러 처리

`src/lib/api.ts`의 `beforeError` 훅에서 공통 에러 처리를 합니다.

```typescript
// 커스텀 에러 클래스 (선택적)
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

### 개별 에러 처리

```typescript
import { HTTPError } from 'ky'

try {
  const user = await userService.getById('999')
} catch (error) {
  if (error instanceof HTTPError) {
    const errorBody = await error.response.json()
    console.error(`${error.response.status}: ${errorBody.message}`)
  }
}
```

---

## 인증 토큰 관리

현재 `src/lib/api.ts`는 `localStorage`에서 토큰을 읽습니다.  
Zustand와 통합하여 더 안전하게 관리할 수 있습니다.

```typescript
// src/store/auth.store.ts (예시)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: string | null
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'auth-token' }
  )
)

// lib/api.ts의 getAuthToken을 store를 사용하도록 수정
function getAuthToken() {
  return useAuthStore.getState().token
}
```
