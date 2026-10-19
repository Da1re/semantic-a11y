import { JUDGED_BY, JUDGED_BY_LABEL } from '../../constants/judged-by';
import { SEVERITY, SEVERITY_LABEL } from '../../constants/severity';
import { usePlaygroundStore } from '../../store/use-playground-store';

const LINE = {
  rule: { className: 'border-solid rounded-full', label: '실선 · 둥근 핀' },
  ai: { className: 'border-dashed rounded-sm', label: '점선 · 네모 핀' },
} as const;

const SEVERITY_DOT = { critical: 'bg-red-700', serious: 'bg-orange-700', moderate: 'bg-sky-700' } as const;

export function LayerToggles() {
  const layers = usePlaygroundStore((state) => state.layers);
  const toggleLayer = usePlaygroundStore((state) => state.toggleLayer);
  const focusMode = usePlaygroundStore((state) => state.focusMode);
  const toggleFocusMode = usePlaygroundStore((state) => state.toggleFocusMode);

  return (
    <fieldset className="rounded-lg border border-slate-200 p-3">
      <legend className="px-1 text-sm font-semibold">미리보기 표시</legend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {Object.values(JUDGED_BY).map((judgedBy) => (
          <label key={judgedBy} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={layers[judgedBy]}
              onChange={() => toggleLayer(judgedBy)}
              className="size-4 accent-blue-700"
            />
            {JUDGED_BY_LABEL[judgedBy].ko} 판정
            <span aria-hidden="true" className={`h-3 w-6 border-2 border-slate-700 ${LINE[judgedBy].className}`} />
            <span className="text-slate-600">{LINE[judgedBy].label}</span>
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={focusMode} onChange={toggleFocusMode} className="size-4 accent-blue-700" />
          집중 모드
          <span className="text-slate-600">선택한 위반만 남기고 나머지를 흐림</span>
        </label>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-700">
        <span>심각도</span>
        {Object.values(SEVERITY).map((severity) => (
          <span key={severity} className="flex items-center gap-1">
            <span aria-hidden="true" className={`size-3 rounded-full ${SEVERITY_DOT[severity]}`} />
            {SEVERITY_LABEL[severity].ko}
          </span>
        ))}
      </p>
    </fieldset>
  );
}
