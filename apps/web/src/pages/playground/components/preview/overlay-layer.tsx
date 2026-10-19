import { createPortal } from 'react-dom';
import type { Violation } from '../../engine/types';
import { useCurrentAudit } from '../../hooks/use-current-audit';
import { useOverlayRects } from '../../hooks/use-overlay-rects';
import { useScrollToSelected } from '../../hooks/use-scroll-to-selected';
import { toEmphasis } from '../../models/overlay-box';
import { usePlaygroundStore } from '../../store/use-playground-store';
import { FocusScrim } from './focus-scrim';
import { OverlayBox } from './overlay-box';

// 결과가 없을 때도 같은 배열을 넘겨야 위치 계산 effect가 매번 다시 돌지 않는다
const NO_VIOLATIONS: Violation[] = [];

interface OverlayLayerProps {
  doc: Document;
}

// 미리보기 문서 안에 직접 그려서, 샘플을 스크롤해도 표시가 요소를 따라가게 한다
export function OverlayLayer({ doc }: OverlayLayerProps) {
  const { data } = useCurrentAudit();
  const layers = usePlaygroundStore((state) => state.layers);
  const active = usePlaygroundStore((state) => state.highlighted ?? state.selected);
  const selected = usePlaygroundStore((state) => state.selected);
  const focusMode = usePlaygroundStore((state) => state.focusMode);
  const toggleSelect = usePlaygroundStore((state) => state.toggleSelect);
  const violations = data?.violations ?? NO_VIOLATIONS;
  const boxes = useOverlayRects(doc, violations);
  useScrollToSelected(doc, violations);

  // 집중 모드는 선택한 위반이 있을 때만 켜진다. 선택이 없으면 평소처럼 모두 보인다
  const focused = focusMode ? boxes.find((box) => box.violation.fingerprint === selected) : undefined;
  const visible = focused ? [focused] : boxes.filter((box) => layers[box.violation.judgedBy]);

  return createPortal(
    <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, zIndex: 2147483647 }}>
      {focused && <FocusScrim rect={focused.rect} />}
      {visible.map((box) => (
        <OverlayBox
          key={box.violation.fingerprint}
          box={box}
          emphasis={toEmphasis(active, box.violation.fingerprint)}
          onSelect={toggleSelect}
        />
      ))}
    </div>,
    doc.body,
  );
}
