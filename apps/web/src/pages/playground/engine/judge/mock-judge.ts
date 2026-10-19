import { SEVERITY, type Severity } from '../../constants/severity';
import { isKwcagId } from '../map-to-kwcag';
import type { Fix, LocalizedText } from '../types';
import type { Judge, Judgement } from './judge';

export interface RawJudgementFile {
  judgements: {
    selector: string;
    kwcag: string;
    verdict: string;
    confidence: number;
    severity?: string;
    reason: LocalizedText;
    fix?: Fix;
  }[];
  ruleFixes: { selector: string; rule: string; fix: Fix }[];
}

type RawJudgement = RawJudgementFile['judgements'][number];

const SEVERITIES: readonly string[] = Object.values(SEVERITY);

function isSeverity(value: string | undefined): value is Severity {
  return value !== undefined && SEVERITIES.includes(value);
}

function toJudgement(raw: RawJudgement): Judgement[] {
  if (!isKwcagId(raw.kwcag)) return [];
  const verdict = raw.verdict === 'fail' ? 'fail' : 'pass';
  const severity = isSeverity(raw.severity) ? raw.severity : undefined;
  return [{ ...raw, kwcag: raw.kwcag, verdict, severity }];
}

// mock은 다시 판단할 수 없으므로, 제안한 수정 코드가 문서에 들어 있으면 고쳐진 것으로 본다
function toFixedVerdict(judgement: Judgement, html: string): Judgement {
  if (!judgement.fix || !html.includes(judgement.fix.after)) return judgement;
  const reason = {
    ko: '수정 코드가 적용되어 기준을 충족한다.',
    en: 'The suggested fix has been applied, so the criterion is met.',
  };
  return { ...judgement, verdict: 'pass', severity: undefined, reason, fix: undefined };
}

// 실제 LLM이라면 후보 요소를 보고 판정한다. mock은 샘플마다 적어 둔 판정 중 페이지에 실제로 있는 요소만 돌려준다
export function createMockJudge(file: RawJudgementFile): Judge {
  return {
    mode: 'mock',
    judge: async ({ doc, html }) => ({
      judgements: file.judgements
        .flatMap(toJudgement)
        .filter((j) => doc.querySelector(j.selector) !== null)
        .map((j) => toFixedVerdict(j, html)),
      ruleFixes: file.ruleFixes.map(({ selector, rule, fix }) => ({ selector, ruleId: rule, fix })),
    }),
  };
}
