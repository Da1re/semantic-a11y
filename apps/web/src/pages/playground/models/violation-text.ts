import { KWCAG } from '../constants/kwcag-catalog';
import type { ReportLocale } from '../constants/report-locale';
import type { Violation } from '../engine/types';

function toKoTitle({ kwcag }: Violation): string {
  if (kwcag === null) return 'KWCAG 대응 항목 없음(권장 사항)';
  return `KWCAG ${kwcag} ${KWCAG[kwcag].ko}`;
}

// 해외 독자는 WCAG 번호로 찾으므로 영문 제목은 WCAG를 앞에 둔다
function toEnTitle({ kwcag, wcag }: Violation): string {
  const wcagPart = wcag.length === 0 ? '' : `WCAG ${wcag.join(', ')} · `;
  if (kwcag === null) return `${wcagPart}Best practice (no KWCAG item)`;
  return `${wcagPart}KWCAG ${kwcag} ${KWCAG[kwcag].en}`;
}

const TITLE_BY_LOCALE: Record<ReportLocale, (violation: Violation) => string> = { ko: toKoTitle, en: toEnTitle };

const NO_MAPPING: Record<ReportLocale, { kwcag: string; wcag: string }> = {
  ko: { kwcag: 'KWCAG 대응 없음', wcag: 'WCAG 대응 없음' },
  en: { kwcag: 'No KWCAG item', wcag: 'No WCAG criterion' },
};

const SOURCE_TEXT: Record<ReportLocale, { rule: string; ai: string }> = {
  ko: { rule: 'axe 규칙', ai: 'AI 판정 · 신뢰도' },
  en: { rule: 'axe rule', ai: 'AI judgement · confidence' },
};

export function toViolationTitle(violation: Violation, locale: ReportLocale): string {
  return TITLE_BY_LOCALE[locale](violation);
}

export function toStandardText({ kwcag, wcag }: Violation, locale: ReportLocale): string {
  const kwcagText = kwcag === null ? NO_MAPPING[locale].kwcag : `KWCAG ${kwcag}`;
  const wcagText = wcag.length === 0 ? NO_MAPPING[locale].wcag : `WCAG ${wcag.join(', ')}`;
  return `${kwcagText} · ${wcagText}`;
}

export function toSourceText({ judgedBy, ruleId, confidence = 0 }: Violation, locale: ReportLocale): string {
  if (judgedBy === 'rule') return `${SOURCE_TEXT[locale].rule} ${ruleId}`;
  return `${SOURCE_TEXT[locale].ai} ${Math.round(confidence * 100)}%`;
}
