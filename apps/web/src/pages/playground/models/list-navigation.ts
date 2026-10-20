// W3C APG 아코디언 패턴의 선택 키. 끝에서 반대쪽으로 돌아가지 않아야 화면낭독기 사용자가 위치를 잃지 않는다
const KEY_TO_INDEX: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => Math.min(index + 1, count - 1),
  ArrowUp: (index) => Math.max(index - 1, 0),
  Home: () => 0,
  End: (_index, count) => count - 1,
};

// 목록 이동 키가 아니면 null을 돌려, 나머지 키(Enter·Space·Tab)는 버튼 기본 동작에 맡긴다
export function toNextIndex(key: string, index: number, count: number): number | null {
  const toIndex = KEY_TO_INDEX[key];
  if (!toIndex || index < 0) return null;
  return toIndex(index, count);
}
