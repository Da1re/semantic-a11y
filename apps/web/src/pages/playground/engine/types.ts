import type { JudgedBy } from '../constants/judged-by';
import type { KwcagId } from '../constants/kwcag-catalog';
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

export type JudgeMode = 'mock' | 'disconnected' | 'llm';

export interface AuditStats {
  checkedElements: number;
  candidates: number;
  aiPassed: number;
  byJudge: Record<JudgedBy, number>;
}

export interface AuditReport {
  source: AuditSource;
  judgeMode: JudgeMode;
  stats: AuditStats;
  violations: Violation[];
}
