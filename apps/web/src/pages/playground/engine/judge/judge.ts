import type { KwcagId } from '../../constants/kwcag-catalog';
import type { Severity } from '../../constants/severity';
import type { Fix, JudgeMode, LocalizedText } from '../types';

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

export interface JudgeInput {
  doc: Document;
  candidates: Element[];
  html: string;
}

export interface JudgeOutput {
  judgements: Judgement[];
  ruleFixes: RuleFix[];
}

export interface Judge {
  readonly mode: JudgeMode;
  judge(input: JudgeInput): Promise<JudgeOutput>;
}
