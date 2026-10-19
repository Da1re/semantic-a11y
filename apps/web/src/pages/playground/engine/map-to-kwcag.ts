import { KWCAG, type KwcagId } from '../constants/kwcag-catalog';

// axe는 아래 규칙을 WCAG 4.1.2로 묶지만, 국내 심사에서는 대체 텍스트·레이블 항목으로 본다
const RULE_OVERRIDES: Record<string, KwcagId> = {
  'button-name': '5.1.1',
  'input-button-name': '5.1.1',
  label: '7.3.2',
  'select-name': '7.3.2',
};

export function isKwcagId(id: string): id is KwcagId {
  return Object.hasOwn(KWCAG, id);
}

const KWCAG_BY_WCAG = new Map<string, KwcagId>(
  Object.keys(KWCAG)
    .filter(isKwcagId)
    .flatMap((id) => KWCAG[id].wcag.map((sc) => [sc, id] as const)),
);

// axe 태그 'wcag1412' → 성공기준 '1.4.12'
export function wcagFromTags(tags: string[]): string[] {
  return tags
    .filter((tag) => /^wcag\d{3,4}$/.test(tag))
    .map((tag) => tag.slice(4))
    .map((digits) => `${digits[0]}.${digits[1]}.${digits.slice(2)}`);
}

export function kwcagFromAxe(ruleId: string, tags: string[]): KwcagId | null {
  const override = RULE_OVERRIDES[ruleId];
  if (override) return override;
  const mapped = wcagFromTags(tags)
    .map((sc) => KWCAG_BY_WCAG.get(sc))
    .find((id) => id !== undefined);
  return mapped ?? null;
}
