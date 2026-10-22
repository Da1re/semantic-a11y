import type { KwcagId } from '../../constants/kwcag-catalog';
import { SEVERITY, type Severity } from '../../constants/severity';
import { isKwcagId } from '../map-to-kwcag';
import type { Fix, LocalizedText } from '../types';

export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function toKwcag(value: unknown): KwcagId | null {
  return typeof value === 'string' && isKwcagId(value) ? value : null;
}

export function toVerdict(value: unknown): 'pass' | 'fail' | null {
  if (value === 'pass' || value === 'fail') return value;
  return null;
}

export function toConfidence(value: unknown): number | null {
  const isInRange = typeof value === 'number' && value >= 0 && value <= 1;
  return isInRange ? value : null;
}

export function toSeverity(value: unknown): Severity | undefined {
  return Object.values(SEVERITY).find((severity) => severity === value);
}

export function toReason(value: unknown): LocalizedText | null {
  if (!isRecord(value)) return null;
  const reason = { ko: toText(value.ko), en: toText(value.en) };
  return reason.ko !== '' && reason.en !== '' ? reason : null;
}

/** 빈 문자열이면 "수정 코드 없음"으로 약속했으므로 undefined */
export function toFix(value: unknown): Fix | undefined {
  if (!isRecord(value)) return undefined;
  const { before, after } = value;
  const isUsable = typeof before === 'string' && typeof after === 'string' && before !== '' && before !== after;
  return isUsable ? { before, after } : undefined;
}

// 수정 코드 적용은 문자열 치환이라, 원문에 두 번 이상 나오면 엉뚱한 곳을 고칠 수 있다
export function occursOnce(html: string, needle: string): boolean {
  const first = html.indexOf(needle);
  return first !== -1 && html.indexOf(needle, first + 1) === -1;
}

export function matchesOneElement(doc: Document, selector: string): boolean {
  try {
    return doc.querySelectorAll(selector).length === 1;
  } catch {
    return false;
  }
}
