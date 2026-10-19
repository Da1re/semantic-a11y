import { KWCAG } from '../constants/kwcag-catalog';
import { fingerprint } from './fingerprint';
import type { Judgement } from './judge/judge';
import { toSnippet } from './snippet';
import type { Violation } from './types';

export function toAiViolations(judgements: Judgement[], doc: Document, sourceKey: string): Violation[] {
  return judgements
    .filter((j) => j.verdict === 'fail')
    .map(
      (j): Violation => ({
        fingerprint: fingerprint([sourceKey, j.kwcag, j.selector]),
        kwcag: j.kwcag,
        wcag: [...KWCAG[j.kwcag].wcag],
        severity: j.severity ?? 'moderate',
        judgedBy: 'ai',
        confidence: j.confidence,
        // 신뢰도가 낮은 판정은 사람이 확인하기 전까지 확정하지 않는다
        needsReview: j.confidence < 0.7,
        selector: j.selector,
        snippet: toSnippet(doc.querySelector(j.selector)?.outerHTML ?? ''),
        reason: j.reason,
        fix: j.fix,
      }),
    );
}
