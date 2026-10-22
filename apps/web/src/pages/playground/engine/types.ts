import type { JudgedBy } from '../constants/judged-by';
import type { KwcagId } from '../constants/kwcag-catalog';
import type { LlmProviderId } from '../constants/llm-provider';
import type { Severity } from '../constants/severity';

export interface LocalizedText {
  ko: string;
  en: string;
}

export interface Fix {
  before: string;
  after: string;
}

export interface Violation {
  fingerprint: string;
  kwcag: KwcagId | null;
  wcag: string[];
  severity: Severity;
  judgedBy: JudgedBy;
  ruleId?: string;
  confidence?: number;
  needsReview: boolean;
  selector: string;
  snippet: string;
  reason: LocalizedText;
  fix?: Fix;
}

export type AuditSource = { kind: 'sample'; sampleId: string } | { kind: 'html'; hash: string };

/** awaiting: 내 AI에 보낼 요청만 만들고 답을 기다리는 중(아직 AI 판정 없음) */
export type JudgeMode = 'mock' | 'disconnected' | 'llm' | 'awaiting';

export interface AuditStats {
  checkedElements: number;
  candidates: number;
  aiPassed: number;
  byJudge: Record<JudgedBy, number>;
}

export interface JudgeRejection {
  selector: string;
  reason: string;
}

export interface LlmUsage {
  inputTokens: number;
  outputTokens: number;
}

/** 실제 모델로 판정한 기록. API 키는 담지 않는다(리포트와 내보내기에 그대로 실리므로) */
export interface LlmJudgeMeta {
  provider: LlmProviderId;
  model: string;
  vision: boolean;
  imagesSent: number;
  candidatesSent: number;
  usage: LlmUsage;
  /** 검증기가 버린 판정과 이유 */
  rejected: JudgeRejection[];
  /** 판정은 남기고 수정 코드만 버린 수(fix.before가 페이지에 한 번만 나오지 않음) */
  droppedFixes: number;
}

/** 내 AI에 붙여 넣을 요청. 이미지는 화면에서 한 장으로 묶어 내려받게 한다 */
export interface ManualRequest {
  prompt: string;
  images: { selector: string; dataUrl: string }[];
}

export interface AuditReport {
  source: AuditSource;
  judgeMode: JudgeMode;
  judgeMeta?: LlmJudgeMeta;
  /** 내 AI로 판정할 때만 있다. 리포트 내보내기에는 싣지 않는다 */
  manualRequest?: ManualRequest;
  stats: AuditStats;
  violations: Violation[];
}
