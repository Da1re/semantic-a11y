import { useId } from 'react';
import { JUDGED_BY_LABEL } from '../../constants/judged-by';
import { SEVERITY_LABEL, type Severity } from '../../constants/severity';
import type { Violation } from '../../engine/types';
import { toViolationTitle } from '../../models/violation-text';
import { usePlaygroundStore } from '../../store/use-playground-store';
import { ViolationDetail } from './detail/violation-detail';
import { ReviewBadge } from './review-badge';

const SEVERITY_STYLE: Record<Severity, { pin: string; badge: string }> = {
  critical: { pin: 'bg-red-700', badge: 'bg-red-100 text-red-800' },
  serious: { pin: 'bg-orange-700', badge: 'bg-orange-100 text-orange-800' },
  moderate: { pin: 'bg-sky-700', badge: 'bg-sky-100 text-sky-900' },
};

interface ViolationItemProps {
  violation: Violation;
  number: number;
}

export function ViolationItem({ violation, number }: ViolationItemProps) {
  const detailId = useId();
  const isSelected = usePlaygroundStore((state) => state.selected === violation.fingerprint);
  const highlight = usePlaygroundStore((state) => state.highlight);
  const toggleSelect = usePlaygroundStore((state) => state.toggleSelect);
  const locale = usePlaygroundStore((state) => state.locale);
  const { fingerprint, severity, judgedBy } = violation;
  const style = SEVERITY_STYLE[severity];
  const pinShape = judgedBy === 'rule' ? 'rounded-full' : 'rounded-md';

  return (
    <li className="rounded-lg border border-slate-200 has-aria-expanded:border-blue-700">
      {/* 펼침 버튼 안에 복사 버튼·링크를 넣으면 대화형 요소가 중첩되므로 상세는 버튼 밖에 둔다 */}
      <button
        type="button"
        aria-expanded={isSelected}
        aria-controls={detailId}
        onClick={() => toggleSelect(fingerprint)}
        onMouseEnter={() => highlight(fingerprint)}
        onMouseLeave={() => highlight(null)}
        onFocus={() => highlight(fingerprint)}
        onBlur={() => highlight(null)}
        className="w-full rounded-lg p-3 text-left hover:bg-slate-50 aria-expanded:rounded-b-none aria-expanded:bg-blue-50"
      >
        <span className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className={`inline-flex size-6 items-center justify-center text-white ${pinShape} ${style.pin}`}>
            {number}
          </span>
          <span lang={locale} className={`rounded px-1.5 py-0.5 ${style.badge}`}>
            {SEVERITY_LABEL[severity][locale]}
          </span>
          <span lang={locale} className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">
            {JUDGED_BY_LABEL[judgedBy][locale]}
          </span>
          <ReviewBadge fingerprint={fingerprint} needsReview={violation.needsReview} />
        </span>
        <span lang={locale} className="mt-2 block text-sm font-semibold">
          {toViolationTitle(violation, locale)}
        </span>
        {/* 펼치면 상세에 근거 전문이 나오므로 요약은 접혀 있을 때만 보인다 */}
        {!isSelected && (
          <span lang={locale} className="mt-1 line-clamp-2 block text-sm text-slate-700">
            {violation.reason[locale]}
          </span>
        )}
      </button>
      <div id={detailId} hidden={!isSelected}>
        <ViolationDetail violation={violation} />
      </div>
    </li>
  );
}
