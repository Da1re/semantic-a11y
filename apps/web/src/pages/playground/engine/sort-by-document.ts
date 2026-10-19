import type { Violation } from './types';

// 핀 번호가 화면 위에서 아래 순서로 붙도록 요소의 문서 순서대로 정렬한다
export function sortByDocument(violations: Violation[], doc: Document): Violation[] {
  const order = new Map(Array.from(doc.querySelectorAll('*'), (el, index) => [el, index] as const));
  const position = (violation: Violation) => {
    const el = doc.querySelector(violation.selector);
    return el === null ? 0 : (order.get(el) ?? 0);
  };
  return [...violations].sort((a, b) => position(a) - position(b));
}
