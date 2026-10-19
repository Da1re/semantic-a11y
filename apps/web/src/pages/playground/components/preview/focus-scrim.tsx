import type { OverlayBoxData } from '../../models/overlay-box';

interface FocusScrimProps {
  rect: OverlayBoxData['rect'];
}

// 선택한 요소 자리만 뚫린 막을 씌워 나머지를 흐린다. 미리보기 문서 안이라 Tailwind 없이 인라인 스타일을 쓴다
export function FocusScrim({ rect }: FocusScrimProps) {
  return (
    <div
      style={{
        position: 'absolute',
        ...rect,
        borderRadius: 4,
        // 문서가 길어도 선택 영역 밖이 모두 덮이도록 그림자를 아주 넓게 편다
        boxShadow: '0 0 0 20000px rgba(15, 23, 42, 0.55)',
        pointerEvents: 'none',
      }}
    />
  );
}
