import { LLM_PROVIDER, LLM_PROVIDER_LABEL } from '../constants/llm-provider';
import type { ReportLocale } from '../constants/report-locale';
import { REPORT_VIEW_LABEL, type ReportView } from '../constants/report-view';
import { SAMPLE_ID, SAMPLE_LABEL, type SampleId } from '../constants/sample';
import { SEVERITY_LABEL } from '../constants/severity';
import type { AuditReport, AuditSource, Fix, JudgeMode, Violation } from '../engine/types';
import { hasAiResult } from './judge-mode';
import { toSourceText, toStandardText, toViolationTitle } from './violation-text';

export interface ReportContext {
  locale: ReportLocale;
  view: ReportView;
  generatedAt: Date;
  /** 검수에서 반려된 판정의 지문. 사람이 틀렸다고 본 판정은 리포트에 싣지 않는다 */
  rejected: ReadonlySet<string>;
}

export interface ReportDocumentItem {
  title: string;
  meta: { label: string; value: string }[];
  reason: string;
  snippet: string;
  fix?: Fix;
}

export interface ReportDocument {
  locale: ReportLocale;
  title: string;
  meta: { label: string; value: string }[];
  summary: { label: string; value: number }[];
  itemsTitle: string;
  items: ReportDocumentItem[];
  labels: { summaryItem: string; summaryValue: string; snippet: string; before: string; after: string; noFix: string };
}

const TEXT = {
  ko: {
    title: 'semantic-a11y 접근성 점검 리포트',
    target: '대상', view: '보기', generatedAt: '생성', judge: '판정',
    pastedHtml: '붙여 넣은 HTML',
    checked: '검사한 요소', candidates: 'AI 판정 대상', rule: '규칙 위반', ai: 'AI 판정 위반', review: '사람 확인 필요',
    items: (n: number) => `위반 ${n}건`,
    standard: '기준', severity: '심각도', source: '출처', selector: '위치', needsReview: '사람 확인 필요(AI 신뢰도 70% 미만)',
    summaryItem: '항목', summaryValue: '값',
    snippet: '코드 조각', before: '수정 전', after: '수정 후', noFix: '수정 코드 제안 없음',
  },
  en: {
    title: 'semantic-a11y accessibility report',
    target: 'Target', view: 'View', generatedAt: 'Generated', judge: 'Judgement',
    pastedHtml: 'Pasted HTML',
    checked: 'Elements checked', candidates: 'AI candidates', rule: 'Rule violations', ai: 'AI violations', review: 'Needs human review',
    items: (n: number) => `${n} violation${n === 1 ? '' : 's'}`,
    standard: 'Criteria', severity: 'Severity', source: 'Source', selector: 'Selector', needsReview: 'Needs human review (AI confidence below 70%)',
    summaryItem: 'Item', summaryValue: 'Count',
    snippet: 'Code snippet', before: 'Before', after: 'After', noFix: 'No fix suggested',
  },
} as const;

const JUDGE_NOTE: Record<JudgeMode, Record<ReportLocale, string>> = {
  mock: {
    ko: 'axe-core 규칙 점검 + AI 판정(샘플마다 미리 준비한 mock 결과)',
    en: 'axe-core rules + AI judgement (mock results prepared for each sample)',
  },
  disconnected: {
    ko: 'axe-core 규칙 점검만(AI 미연결)',
    en: 'axe-core rules only (AI not connected)',
  },
  llm: { ko: 'axe-core 규칙 점검 + AI 판정(LLM)', en: 'axe-core rules + AI judgement (LLM)' },
  awaiting: {
    ko: 'axe-core 규칙 점검만(내 AI의 답을 아직 붙여 넣지 않음)',
    en: 'axe-core rules only (answer from my AI not pasted yet)',
  },
};

// 어떤 모델이 판정했는지 남겨야 리포트를 다시 읽을 때 결과를 믿을 만한지 판단할 수 있다(키는 meta에 없다)
function toJudgeText(report: AuditReport, locale: ReportLocale): string {
  const note = JUDGE_NOTE[report.judgeMode][locale];
  const meta = report.judgeMeta;
  if (!meta) return note;
  if (meta.provider === LLM_PROVIDER.MANUAL) return `${note} · ${LLM_PROVIDER_LABEL.manual[locale]}`;
  return `${note} · ${meta.provider} ${meta.model}`;
}

function isSampleId(id: string): id is SampleId {
  return Object.values(SAMPLE_ID).some((sampleId) => sampleId === id);
}

function toTargetLabel(source: AuditSource, locale: ReportLocale): string {
  if (source.kind === 'html') return `${TEXT[locale].pastedHtml} (${source.hash})`;
  if (!isSampleId(source.sampleId)) return source.sampleId;
  return SAMPLE_LABEL[source.sampleId][locale];
}

export function toExportedViolations(report: AuditReport, rejected: ReadonlySet<string>): Violation[] {
  return report.violations.filter((violation) => !rejected.has(violation.fingerprint));
}

function toItem(violation: Violation, locale: ReportLocale): ReportDocumentItem {
  const text = TEXT[locale];
  const meta = [
    { label: text.standard, value: toStandardText(violation, locale) },
    { label: text.severity, value: SEVERITY_LABEL[violation.severity][locale] },
    { label: text.source, value: toSourceText(violation, locale) },
    { label: text.selector, value: violation.selector },
  ];
  const reviewMeta = violation.needsReview ? [{ label: text.review, value: text.needsReview }] : [];
  return {
    title: toViolationTitle(violation, locale),
    meta: [...meta, ...reviewMeta],
    reason: violation.reason[locale],
    snippet: violation.snippet,
    fix: violation.fix,
  };
}

export function toReportDocument(report: AuditReport, context: ReportContext): ReportDocument {
  const { locale, view, generatedAt, rejected } = context;
  const text = TEXT[locale];
  const violations = toExportedViolations(report, rejected);
  const countBy = (judgedBy: Violation['judgedBy']) => violations.filter((v) => v.judgedBy === judgedBy).length;
  // AI 판정이 없는 점검에서 "AI 위반 0"을 실으면 문제가 없다는 뜻으로 읽히므로 AI 줄을 아예 뺀다
  const aiSummary = hasAiResult(report.judgeMode)
    ? [
        { label: text.candidates, value: report.stats.candidates },
        { label: text.ai, value: countBy('ai') },
        { label: text.review, value: violations.filter((v) => v.needsReview).length },
      ]
    : [];
  return {
    locale,
    title: text.title,
    meta: [
      { label: text.target, value: toTargetLabel(report.source, locale) },
      { label: text.view, value: REPORT_VIEW_LABEL[view][locale] },
      { label: text.generatedAt, value: generatedAt.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US') },
      { label: text.judge, value: toJudgeText(report, locale) },
    ],
    summary: [
      { label: text.checked, value: report.stats.checkedElements },
      { label: text.rule, value: countBy('rule') },
      ...aiSummary,
    ],
    itemsTitle: text.items(violations.length),
    items: violations.map((violation) => toItem(violation, locale)),
    labels: {
      summaryItem: text.summaryItem,
      summaryValue: text.summaryValue,
      snippet: text.snippet,
      before: text.before,
      after: text.after,
      noFix: text.noFix,
    },
  };
}

// JSON은 다른 도구가 다시 읽을 수 있게 언어를 고르지 않고 한·영 근거를 모두 담는다
export function toReportJson(report: AuditReport, context: ReportContext): string {
  const violations = toExportedViolations(report, context.rejected);
  const body = {
    tool: 'semantic-a11y',
    generatedAt: context.generatedAt.toISOString(),
    source: report.source,
    view: context.view,
    judgeMode: report.judgeMode,
    judgeMeta: report.judgeMeta ?? null,
    stats: report.stats,
    excludedByReview: report.violations.length - violations.length,
    violations,
  };
  return JSON.stringify(body, null, 2);
}
