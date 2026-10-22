import { toCandidateInput, type CandidateInput } from './candidate-input';
import type { JudgeInput, RuleTarget } from './judge';
import { collectContextElements, toPageSummary, type PageSummary } from './page-context';

export interface JudgeRequest {
  page: PageSummary;
  candidates: CandidateInput[];
  ruleViolations: RuleTarget[];
}

export interface PreparedRequest {
  request: JudgeRequest;
  /** 선택자 → 요소. 이미지 첨부와 검증기가 같은 요소를 다시 찾지 않고 쓴다 */
  elements: Map<string, Element>;
}

export function prepareJudgeRequest({ doc, candidates, ruleViolations }: JudgeInput): PreparedRequest {
  const base = new Set(candidates);
  const { regions, texts } = collectContextElements(doc, base);
  const entries = [
    ...candidates.map((el) => ({ el, input: toCandidateInput(el, doc) })),
    ...regions.map((el) => ({ el, input: toCandidateInput(el, doc, 'region') })),
    ...texts.map((el) => ({ el, input: toCandidateInput(el, doc, 'text') })),
  ];
  // 같은 요소가 여러 경로로 모일 수 있어서 선택자로 한 번만 남긴다
  const elements = new Map(entries.map(({ el, input }) => [input.selector, el] as const));
  const unique = new Map(entries.map(({ input }) => [input.selector, input] as const));
  return {
    request: { page: toPageSummary(doc), candidates: [...unique.values()], ruleViolations },
    elements,
  };
}
