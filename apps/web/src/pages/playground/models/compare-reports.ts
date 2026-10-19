import type { AuditReport, Violation } from '../engine/types';

export interface ReportComparison {
  resolved: Violation[];
  remaining: Violation[];
  added: Violation[];
}

// 지문은 source·기준·위치로만 만들어서, 같은 위반이면 수정 전후 점검에서 같은 값이 나온다
export function compareReports(before: AuditReport, after: AuditReport): ReportComparison {
  const beforeKeys = new Set(before.violations.map((v) => v.fingerprint));
  const afterKeys = new Set(after.violations.map((v) => v.fingerprint));
  return {
    resolved: before.violations.filter((v) => !afterKeys.has(v.fingerprint)),
    remaining: after.violations.filter((v) => beforeKeys.has(v.fingerprint)),
    added: after.violations.filter((v) => !beforeKeys.has(v.fingerprint)),
  };
}
