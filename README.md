# Next.js 보일러플레이트

Next.js 15 기반의 프로덕션 레디 보일러플레이트입니다.  
최신 도구 조합으로 빠르게 개발을 시작할 수 있습니다.

## 포함된 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | **Next.js 15** + App Router + **Turbopack** |
| UI | **React 19**, **Tailwind CSS v4**, **Lucide React**, **CVA** |
| 스타일 유틸 | **tailwind-merge** + **clsx** (`cn` 헬퍼) |
| 서버 상태 | **TanStack Query v5** + Devtools |
| 전역 상태 | **Zustand v5** |
| 폼 검증 | **React Hook Form** + **Zod** + **Hook Form Resolvers** |
| HTTP 클라이언트 | **ky** (fetch 기반, 인터셉터 지원) |
| 목업 서버 | **MSW v2** (백엔드 없는 개발/테스트) |
| 알림 | **sonner** (Toast) |
| 에러 처리 | **react-error-boundary** |
| 유닛/컴포넌트 테스트 | **Vitest** + **React Testing Library** |
| E2E 테스트 | **Playwright** |
| 타입 안전성 | **TypeScript** + 환경변수 Zod 검증 |
| 코드 품질 | **ESLint** + **Prettier** + **Husky** + **lint-staged** |

## 빠른 시작

### 1. 저장소 복제 및 초기 설정

```bash
# 저장소 복제
git clone https://github.com/neruu00/Next-js-Boilerplate.git my-app
cd my-app

# 초기 설정 (Git 초기화, .env.local 생성, 의존성 설치)
pnpm run setup
```

`setup` 명령어는 다음을 자동으로 수행합니다:
- Node.js / Next.js / React 버전 확인
- Git 히스토리 초기화 (새 프로젝트로 시작)
- `.env.example` → `.env.local` 복사
- 의존성 설치 (`pnpm install`)
- `setup.js` 자체 삭제 및 초기 커밋 생성

### 2. 환경변수 설정

`.env.local`을 열어 프로젝트에 맞게 수정합니다:

```bash
NEXT_PUBLIC_API_URL="http://localhost:8080/api"  # 백엔드 API URL
NEXT_PUBLIC_MSW_ENABLED="false"
```

### 3. 개발 서버 실행

```bash
# 일반 개발 서버
pnpm dev

# MSW 목업 서버 포함 (백엔드 없이 개발)
pnpm mock
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

---

## 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (Turbopack) |
| `pnpm mock` | MSW 활성화된 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm lint:fix` | ESLint 자동 수정 |
| `pnpm format` | Prettier 포맷팅 |
| `pnpm test` | Vitest 유닛/컴포넌트 테스트 (감시 모드) |
| `pnpm test:ui` | Vitest UI 모드 |
| `pnpm test:coverage` | 커버리지 리포트 생성 |
| `pnpm test:e2e` | Playwright E2E 테스트 |
| `pnpm test:e2e:ui` | Playwright UI 모드 |
| `pnpm clean` | node_modules 초기화 |
| `pnpm setup` | **(최초 1회)** 프로젝트 초기화 |

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃 (MSW, Toast, ErrorBoundary)
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   └── Toaster.tsx     # Toast 알림 컴포넌트
│   └── ErrorBoundary.tsx   # 에러 바운더리
├── layouts/
│   ├── TanstackQueryLayout.tsx
│   └── MSWLayout.tsx       # MSW 초기화
├── lib/
│   ├── api.ts              # ky HTTP 클라이언트
│   ├── env.ts              # 환경변수 타입 검증
│   ├── utils.ts            # cn 헬퍼
│   └── schemas/            # Zod 스키마
├── mocks/                  # MSW 설정
│   ├── handlers/           # API 핸들러
│   ├── data/               # 목 데이터
│   ├── browser.ts
│   └── server.ts
├── services/               # API 서비스 레이어
└── __tests__/              # Vitest 테스트
    ├── setup.ts
    ├── unit/
    └── components/

e2e/                        # Playwright E2E 테스트
docs/                       # 프로젝트 문서
```

---

## 문서

| 문서 | 설명 |
|------|------|
| [MSW 사용 가이드](./docs/msw-guide.md) | 목업 서버 설정 및 핸들러 작성 방법 |
| [테스트 가이드](./docs/testing-guide.md) | Vitest, Testing Library, Playwright 사용법 |
| [API 레이어 가이드](./docs/api-layer.md) | HTTP 클라이언트 및 서비스 패턴 |

---

## 추천 VS Code 확장

- **Prettier** (`esbenp.prettier-vscode`) — 코드 포맷팅
- **ESLint** (`dbaeumer.vscode-eslint`) — 코드 품질
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — `cn`, `cva` 지원
- **Vitest** (`vitest.explorer`) — 테스트 탐색기

---

## 라이선스

MIT License