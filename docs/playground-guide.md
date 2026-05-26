# API Playground 사용 가이드

API Playground는 사내 API 엔드포인트(혹은 MSW 모킹 API)를 프론트엔드 환경에서 직관적으로 테스트할 수 있도록 제공되는 Swagger 스타일의 테스트 환경입니다. 
복잡한 컴포넌트나 서비스 로직을 연동하기 전, 브라우저 상에서 바로 네트워크 요청을 보내보고 응답(또는 에러)을 시각적으로 확인할 수 있습니다.

---

## 📌 주요 기능
1. **분리된 파라미터 입력**: Path, Query, Body(JSON/FormData) 파라미터를 명시적으로 분리하여 입력받습니다.
2. **동적 URL 치환**: `/api/users/:id` 형식의 경로에 Path 파라미터를 입력하면 자동으로 `:id`를 매핑합니다.
3. **직관적인 에러 피드백**: 통신 에러 발생 시, 붉은색 Toast 메시지 알림과 함께 서버가 반환한 Response JSON을 결과 패널에 출력하여 쉬운 디버깅을 돕습니다.
4. **통합 `ky` 클라이언트 기반**: 별도의 `action` 함수를 작성할 필요 없이, 설정(Config)만 선언해두면 Playground 내부에서 자동으로 API 클라이언트(`src/lib/api.ts`)를 호출합니다.

---

## 🚀 사용 방법

Playground 설정은 `src/app/playground/page.tsx` 파일 내에서 관리됩니다.
단순히 `ApiConfig` 타입에 맞춰 엔드포인트를 정의하기만 하면 UI가 자동으로 생성됩니다.

### 1. 기본 API 정의 (GET)
```tsx
import { type ApiConfig } from './_components/ApiPanel';

const MY_API: ApiConfig[] = [
  {
    name: '전체 사용자 조회',
    path: '/api/users', // 호출할 API 경로
    method: 'GET',      // HTTP 메서드
  }
];
```

### 2. Path 파라미터 정의
URL에 `:파라미터명` 형태가 포함된 경우, `pathParams`를 정의하여 UI에 입력 폼을 띄울 수 있습니다.
```tsx
  {
    name: '특정 사용자 조회',
    path: '/api/users/:id',
    method: 'GET',
    pathParams: [
      { name: 'id', placeholder: 'ID (예: 1)', nullable: false }
    ],
  }
```

### 3. Query 파라미터 정의 (Pagination 등)
`queryParams`를 정의하면, 폼에 입력된 값들이 `searchParams`로 자동 변환되어 호출됩니다. (`?page=1&limit=10`)
```tsx
  {
    name: '전체 게시글 조회',
    path: '/api/posts',
    method: 'GET',
    queryParams: [
      { name: 'page', placeholder: '페이지 번호', nullable: true },
      { name: 'limit', placeholder: '개수 (예: 10)', nullable: true }
    ],
  }
```

### 4. POST / PUT 요청 및 Body 파라미터 정의
`bodyParams`를 정의하여 요청 본문(Payload)을 전송할 수 있습니다. 
`bodyType`을 `'json'` (기본값) 또는 `'form'` 으로 지정하면, Playground가 알아서 `application/json` 또는 `multipart/form-data` 형식에 맞춰 전송합니다.

```tsx
  {
    name: '새 사용자 생성',
    path: '/api/users',
    method: 'POST',
    bodyType: 'json', // JSON 요청
    bodyParams: [
      { name: 'name', placeholder: '이름', nullable: false },
      { name: 'email', placeholder: '이메일', nullable: false },
      { name: 'bio', placeholder: '자기소개', nullable: true } // 선택값 (Optional 뱃지 표기)
    ],
  }
```

---

## 🎨 화면에 패널 추가하기

설정한 API 배열은 `ApiPanel` 컴포넌트의 `apis` Props로 넘겨주면 됩니다.
여러 도메인(Users, Posts, Products 등)별로 `ApiPanel`을 분리해서 렌더링하면 관리가 용이합니다.

```tsx
// src/app/playground/page.tsx
export default function PlaygroundPage() {
  const [result, setResult] = useState<string>('결과가 여기에 표시됩니다.');

  return (
    // ...
    <ApiPanel title="Users API" apis={USERS_API} onResult={setResult} />
    <ApiPanel title="Posts API" apis={POSTS_API} onResult={setResult} />
    // ...
  )
}
```

---

## 🚨 필수값 및 예외 처리
- `nullable: false`(혹은 생략)로 설정된 파라미터의 입력창을 비워둔 채 실행 버튼을 누르면, 노란색 Toast 알림과 함께 통신이 차단됩니다.
- 서버(혹은 MSW)에서 `400`, `403`, `404` 등의 에러를 반환하면, 우측 결과 창에 에러 바디 내용(`{"message": "..."}`)이 파싱되어 그대로 노출됩니다.
