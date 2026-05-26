# 테스트 가이드

이 프로젝트는 두 가지 테스트 레이어를 사용합니다.

| 레이어 | 도구 | 대상 | 실행 명령 |
|--------|------|------|----------|
| 유닛 / 컴포넌트 | Vitest + Testing Library | 함수, 훅, 컴포넌트 | `pnpm test` |
| E2E | Playwright | 실제 브라우저 흐름 | `pnpm test:e2e` |

## 목차

- [Vitest (유닛 / 컴포넌트 테스트)](#vitest-유닛--컴포넌트-테스트)
  - [실행 방법](#실행-방법)
  - [파일 구조](#파일-구조)
  - [유틸 함수 테스트](#유틸-함수-테스트)
  - [훅 테스트](#훅-테스트)
  - [컴포넌트 테스트](#컴포넌트-테스트)
  - [MSW와 함께 API 테스트](#msw와-함께-api-테스트)
- [Playwright (E2E 테스트)](#playwright-e2e-테스트)
  - [최초 설정](#최초-설정)
  - [실행 방법](#실행-방법-1)
  - [테스트 작성](#테스트-작성)
- [커버리지](#커버리지)

---

## Vitest (유닛 / 컴포넌트 테스트)

### 실행 방법

```bash
# 감시 모드 (파일 변경 시 자동 재실행)
pnpm test

# UI 모드 (브라우저에서 결과 확인)
pnpm test:ui

# 커버리지 리포트 생성
pnpm test:coverage

# 특정 파일만 테스트
pnpm test utils.test.ts

# 특정 패턴 매칭 테스트
pnpm test --grep "cn 유틸"
```

### 파일 구조

```
src/__tests__/
├── setup.ts              ← 전역 설정 (jest-dom, MSW 서버)
├── unit/                 ← 유틸 함수, 훅 단위 테스트
│   └── utils.test.ts
└── components/           ← 컴포넌트 렌더링/인터랙션 테스트
    └── example.test.tsx
```

> **규칙**: 테스트 파일명은 `*.test.ts` 또는 `*.test.tsx` 형식을 사용합니다.

### 유틸 함수 테스트

```typescript
// src/__tests__/unit/utils.test.ts
import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn 유틸', () => {
  it('클래스를 병합합니다', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('Tailwind 충돌을 해결합니다', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})
```

### 훅 테스트

```typescript
// src/__tests__/unit/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('초기값을 반환합니다', () => {
    const { result } = renderHook(() => useCounter(0))
    expect(result.current.count).toBe(0)
  })

  it('increment가 작동합니다', () => {
    const { result } = renderHook(() => useCounter(0))
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })
})
```

### 컴포넌트 테스트

```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from '@/components/ui/Button'

describe('Button', () => {
  it('텍스트를 렌더링합니다', () => {
    render(<Button>클릭</Button>)
    expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument()
  })

  it('클릭 이벤트가 발생합니다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>클릭</Button>)
    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disabled 상태에서 클릭이 불가합니다', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button disabled onClick={onClick}>클릭</Button>)
    await user.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })
})
```

### MSW와 함께 API 테스트

MSW는 테스트 환경에서 `src/__tests__/setup.ts`를 통해 자동으로 활성화됩니다.

```typescript
// src/__tests__/components/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import UserList from '@/components/UserList'

describe('UserList', () => {
  it('사용자 목록을 표시합니다', async () => {
    render(<UserList />)

    // MSW가 /api/users를 자동으로 처리
    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument()
    })
  })

  it('에러 시 에러 메시지를 표시합니다', async () => {
    // 이 테스트에서만 에러 응답 반환
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({ message: 'error' }, { status: 500 })
      })
    )

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
```

> **핵심**: `afterEach(() => server.resetHandlers())`가 자동으로 실행되므로  
> `server.use()`로 덮어쓴 핸들러는 각 테스트 후 자동으로 초기화됩니다.

---

## Playwright (E2E 테스트)

### 최초 설정

브라우저 바이너리를 다운로드합니다 (최초 1회, 약 300~500MB):

```bash
pnpm exec playwright install
```

CI 환경에서는 필요한 브라우저만 설치:

```bash
pnpm exec playwright install chromium
```

### 실행 방법

```bash
# 모든 E2E 테스트 실행 (헤드리스)
pnpm test:e2e

# UI 모드 (테스트 트리, 타임트래블 디버깅)
pnpm test:e2e:ui

# 특정 브라우저만
pnpm test:e2e --project=chromium

# 특정 파일만
pnpm test:e2e e2e/home.spec.ts

# 실패한 테스트만 재실행
pnpm test:e2e --last-failed
```

> **참고**: `webServer` 설정으로 개발 서버가 자동으로 시작됩니다.

### 테스트 작성

```typescript
// e2e/login.spec.ts
import { expect, test } from '@playwright/test'

test.describe('로그인', () => {
  test('올바른 자격증명으로 로그인합니다', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('이메일').fill('user@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByRole('button', { name: '로그인' }).click()

    // 대시보드로 리다이렉트 확인
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('안녕하세요')).toBeVisible()
  })

  test('잘못된 자격증명은 에러를 표시합니다', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('이메일').fill('wrong@example.com')
    await page.getByLabel('비밀번호').fill('wrongpassword')
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page.getByRole('alert')).toContainText('로그인 실패')
  })
})
```

#### 자주 사용하는 로케이터

```typescript
// 역할(role)로 찾기 (권장)
page.getByRole('button', { name: '제출' })
page.getByRole('textbox', { name: '이메일' })
page.getByRole('heading', { name: '제목' })

// 레이블로 찾기
page.getByLabel('이메일')

// 텍스트로 찾기
page.getByText('안녕하세요')

// 테스트 ID로 찾기 (data-testid 속성)
page.getByTestId('submit-button')

// CSS 선택자 (최후의 수단)
page.locator('.my-class')
```

---

## 커버리지

```bash
pnpm test:coverage
```

실행 후 `coverage/index.html`을 브라우저로 열면 시각적 커버리지 리포트를 볼 수 있습니다.

```bash
# Windows
start coverage/index.html
```

커버리지 목표:
- **Statements**: 80% 이상
- **Branches**: 70% 이상
- **Functions**: 80% 이상

> `vitest.config.ts`의 `coverage.thresholds`에 임계값을 설정할 수 있습니다.
