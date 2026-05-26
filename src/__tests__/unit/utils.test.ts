/**
 * 유틸리티 함수 단위 테스트 예시
 *
 * `pnpm test` 또는 `pnpm test:ui` 로 실행
 */

import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn (className 병합 유틸)', () => {
  it('클래스 이름을 병합합니다', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('조건부 클래스를 처리합니다', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', true && 'bar')).toBe('foo bar');
  });

  it('Tailwind 클래스 충돌을 해결합니다', () => {
    // tailwind-merge: 뒤에 오는 클래스가 우선
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('undefined와 null을 무시합니다', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('빈 문자열을 처리합니다', () => {
    expect(cn('', 'bar')).toBe('bar');
    expect(cn()).toBe('');
  });
});
