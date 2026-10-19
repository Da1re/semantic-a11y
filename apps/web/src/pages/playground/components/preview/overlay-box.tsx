import type { Severity } from '../../constants/severity';
import type { Emphasis, OverlayBoxData } from '../../models/overlay-box';

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: 'rgb(185, 28, 28)',
  serious: 'rgb(194, 65, 12)',
  moderate: 'rgb(3, 105, 161)',
};

const EMPHASIS_STYLE: Record<Emphasis, { borderWidth: number; opacity: number; background: string }> = {
  normal: { borderWidth: 2, opacity: 1, background: 'transparent' },
  active: { borderWidth: 4, opacity: 1, background: 'rgba(37, 99, 235, 0.1)' },
  dimmed: { borderWidth: 2, opacity: 0.25, background: 'transparent' },
};

interface OverlayBoxProps {
  box: OverlayBoxData;
  emphasis: Emphasis;
  onSelect: (fingerprint: string) => void;
}

// 샘플 문서 안에 그려서 Tailwind 클래스가 없다. 그래서 인라인 스타일을 쓴다
export function OverlayBox({ box, emphasis, onSelect }: OverlayBoxProps) {
  const { violation, number, stackIndex, rect } = box;
  const color = SEVERITY_COLOR[violation.severity];
  const { borderWidth, opacity, background } = EMPHASIS_STYLE[emphasis];
  const isRule = violation.judgedBy === 'rule';

  return (
    <>
      <div
        style={{
          position: 'absolute',
          ...rect,
          boxSizing: 'border-box',
          border: `${borderWidth}px ${isRule ? 'solid' : 'dashed'} ${color}`,
          borderRadius: 4,
          background,
          opacity,
          pointerEvents: 'none',
        }}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => onSelect(violation.fingerprint)}
        style={{
          position: 'absolute',
          top: Math.max(0, rect.top - 11),
          left: Math.max(0, rect.left - 11) + stackIndex * 26,
          width: 22,
          height: 22,
          padding: 0,
          border: '2px solid white',
          borderRadius: isRule ? '50%' : 6,
          background: color,
          color: 'white',
          font: '700 12px/18px system-ui, sans-serif',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
          opacity,
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        {number}
      </button>
    </>
  );
}
