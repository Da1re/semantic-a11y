import type { Fix, JudgeRejection } from '../types';
import type { Judgement, RuleFix, RuleTarget } from './judge';
import {
  isRecord,
  matchesOneElement,
  occursOnce,
  toConfidence,
  toFix,
  toKwcag,
  toReason,
  toSeverity,
  toText,
  toVerdict,
  type UnknownRecord,
} from './judge-output-guards';
import { formatError } from './llm-error';

export interface ValidationContext {
  doc: Document;
  html: string;
  candidateSelectors: ReadonlySet<string>;
  ruleTargets: readonly RuleTarget[];
}

export interface ValidatedOutput {
  judgements: Judgement[];
  ruleFixes: RuleFix[];
  rejected: JudgeRejection[];
  droppedFixes: number;
}

type Parsed<T> = { value: T; fixDropped: boolean } | { rejection: JudgeRejection };

function reject(selector: string, reason: string): { rejection: JudgeRejection } {
  return { rejection: { selector, reason } };
}

// 판정은 맞는데 수정 코드만 틀릴 수 있어서, 수정 코드가 원문에 한 번만 나오지 않으면 그것만 버린다
function toUsableFix(raw: unknown, html: string): { fix?: Fix; fixDropped: boolean } {
  const fix = toFix(raw);
  if (!fix) return { fixDropped: false };
  if (!occursOnce(html, fix.before)) return { fixDropped: true };
  return { fix, fixDropped: false };
}

function parseJudgement(raw: UnknownRecord, ctx: ValidationContext): Parsed<Judgement> {
  const selector = toText(raw.selector);
  const kwcag = toKwcag(raw.kwcag);
  const verdict = toVerdict(raw.verdict);
  const confidence = toConfidence(raw.confidence);
  const reason = toReason(raw.reason);
  const severity = toSeverity(raw.severity);
  const problems: [boolean, string][] = [
    [!ctx.candidateSelectors.has(selector), '요청한 후보에 없는 선택자'],
    [!matchesOneElement(ctx.doc, selector), '문서에서 요소 하나를 가리키지 않는 선택자'],
    [kwcag === null, '기준표에 없는 KWCAG 번호'],
    [verdict === null, '판정이 pass·fail이 아님'],
    [confidence === null, '신뢰도가 0~1 사이 숫자가 아님'],
    [reason === null, '한·영 근거가 비어 있음'],
    [verdict === 'fail' && !severity, '위반인데 심각도가 없음'],
  ];
  const problem = problems.find(([failed]) => failed)?.[1];
  if (problem) return reject(selector, problem);
  if (!kwcag || !verdict || confidence === null || !reason) return reject(selector, '형식 오류');

  if (verdict === 'pass') return { value: { selector, kwcag, verdict, confidence, reason }, fixDropped: false };
  const { fix, fixDropped } = toUsableFix(raw.fix, ctx.html);
  return { value: { selector, kwcag, verdict, confidence, severity, reason, fix }, fixDropped };
}

function parseRuleFix(raw: UnknownRecord, ctx: ValidationContext): Parsed<RuleFix> | null {
  const selector = toText(raw.selector);
  const ruleId = toText(raw.ruleId);
  const fix = toFix(raw.fix);
  // 수정 코드를 못 낸 규칙 위반은 거절이 아니라 "제안 없음"이다
  if (!fix) return null;
  const isRequested = ctx.ruleTargets.some((target) => target.selector === selector && target.ruleId === ruleId);
  if (!isRequested) return reject(selector, '요청하지 않은 규칙 위반의 수정 코드');
  if (!occursOnce(ctx.html, fix.before)) return reject(selector, '수정 전 코드가 페이지에 한 번만 나오지 않음');
  return { value: { selector, ruleId, fix }, fixDropped: false };
}

// 같은 요소·항목 판정이 둘이면 더 확신하는 쪽만 남긴다
function dedupe(judgements: Judgement[]): Judgement[] {
  const byKey = new Map<string, Judgement>();
  judgements.forEach((judgement) => {
    const key = `${judgement.selector}|${judgement.kwcag}`;
    const previous = byKey.get(key);
    if (!previous || previous.confidence < judgement.confidence) byKey.set(key, judgement);
  });
  return [...byKey.values()];
}

function collect<T>(items: (Parsed<T> | null)[]) {
  const parsed = items.filter((item): item is Parsed<T> => item !== null);
  return {
    values: parsed.flatMap((item) => ('value' in item ? [item.value] : [])),
    rejected: parsed.flatMap((item) => ('rejection' in item ? [item.rejection] : [])),
    droppedFixes: parsed.filter((item) => 'value' in item && item.fixDropped).length,
  };
}

/** 모델 응답을 그대로 믿지 않고, 통과한 판정만 리포트에 넣는다. 버린 것은 이유와 함께 돌려준다 */
export function validateJudgeOutput(json: unknown, ctx: ValidationContext): ValidatedOutput {
  if (!isRecord(json) || !Array.isArray(json.judgements) || !Array.isArray(json.ruleFixes)) throw formatError();
  const toRecord = (item: unknown): UnknownRecord => (isRecord(item) ? item : {});
  const judgements = collect(json.judgements.map((item) => parseJudgement(toRecord(item), ctx)));
  const ruleFixes = collect(json.ruleFixes.map((item) => parseRuleFix(toRecord(item), ctx)));
  return {
    judgements: dedupe(judgements.values),
    ruleFixes: ruleFixes.values,
    rejected: [...judgements.rejected, ...ruleFixes.rejected],
    droppedFixes: judgements.droppedFixes,
  };
}
