import type { KwcagId } from '../../constants/kwcag-catalog';
import type { Severity } from '../../constants/severity';
import type { Fix, JudgeMode, LlmJudgeMeta, LocalizedText, ManualRequest } from '../types';

export interface Judgement {
  selector: string;
  kwcag: KwcagId;
  verdict: 'pass' | 'fail';
  confidence: number;
  severity?: Severity;
  reason: LocalizedText;
  fix?: Fix;
}

export interface RuleFix {
  selector: string;
  ruleId: string;
  fix: Fix;
}

/** axe가 찾은 위반. AI에게는 판정이 아니라 수정 코드만 요청한다 */
export interface RuleTarget {
  selector: string;
  ruleId: string;
  html: string;
}

export interface JudgeInput {
  doc: Document;
  candidates: Element[];
  html: string;
  ruleViolations: RuleTarget[];
}

export interface JudgeOutput {
  judgements: Judgement[];
  ruleFixes: RuleFix[];
  /** 실제 모델(llm)로 판정했을 때만 있다 */
  meta?: LlmJudgeMeta;
  /** 내 AI로 판정할 때 사용자에게 건넬 요청 */
  manualRequest?: ManualRequest;
}

export interface Judge {
  readonly mode: JudgeMode;
  judge(input: JudgeInput): Promise<JudgeOutput>;
}
