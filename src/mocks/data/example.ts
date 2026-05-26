/**
 * MSW 목 데이터 (Mock Data)
 *
 * 실제 백엔드 없이 테스트할 데이터를 정의합니다.
 * 필요에 따라 faker 라이브러리를 사용해 동적으로 생성할 수도 있습니다.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    role: 'user',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: '이영희',
    email: 'lee@example.com',
    role: 'user',
    createdAt: '2024-03-01T00:00:00Z',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: '첫 번째 게시글',
    content: 'MSW로 목업 데이터를 쉽게 사용할 수 있습니다.',
    authorId: '1',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: '두 번째 게시글',
    content: 'TanStack Query와 MSW를 함께 사용하면 개발이 더욱 편리합니다.',
    authorId: '2',
    createdAt: '2024-02-10T00:00:00Z',
  },
];
