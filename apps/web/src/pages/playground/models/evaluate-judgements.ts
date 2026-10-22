import type { JudgedBy } from '../constants/judged-by';
import type { AuditReport, Violation } from '../engine/types';

/** samples/<id>/expected.json 한 줄. JSON을 그대로 읽으므로 값은 문자열로 받는다 */
export interface ExpectedLabel {
  id: string;
  selector: string;
  kwcag: string;
  judgedBy: string;
  answer: string;
  note: string;
}

export interface AccuracyRow {
  /** 위반을 위반으로, 정상을 정상으로 본 수 */
  correct: number;
  /** 위반인데 찾지 못한 수 */
  missed: number;
  /** 정상인데 위반으로 본 수 */
  falsePositive: number;
  /** 정답표에 없는 요소·항목을 위반으로 본 수. 틀렸다는 뜻이 아니라 정답표가 다루지 않은 것이다 */
  unlabeled: number;
  labels: number;
}

const toKey = (selector: string, kwcag: string | null) => `${selector}|${kwcag ?? ''}`;

function evaluateOne(found: Violation[], labels: ExpectedLabel[]): AccuracyRow {
  const foundKeys = new Set(found.map((violation) => toKey(violation.selector, violation.kwcag)));
  const labelKeys = new Set(labels.map((label) => toKey(label.selector, label.kwcag)));
  const isFound = (label: ExpectedLabel) => foundKeys.has(toKey(label.selector, label.kwcag));
  const fails = labels.filter((label) => label.answer === 'fail');
  const passes = labels.filter((label) => label.answer === 'pass');
  return {
    correct: fails.filter(isFound).length + passes.filter((label) => !isFound(label)).length,
    missed: fails.filter((label) => !isFound(label)).length,
    falsePositive: passes.filter(isFound).length,
    unlabeled: [...foundKeys].filter((key) => !labelKeys.has(key)).length,
    labels: labels.length,
  };
}

// 요소(선택자)와 KWCAG 항목이 같아야 맞힌 것으로 본다. 같은 요소라도 다른 항목으로 판정하면 놓친 것이다
export function evaluateReport(report: AuditReport, expected: ExpectedLabel[]): Record<JudgedBy, AccuracyRow> {
  const by = (judgedBy: JudgedBy) => ({
    found: report.violations.filter((violation) => violation.judgedBy === judgedBy),
    labels: expected.filter((label) => label.judgedBy === judgedBy),
  });
  const rule = by('rule');
  const ai = by('ai');
  return { rule: evaluateOne(rule.found, rule.labels), ai: evaluateOne(ai.found, ai.labels) };
}
