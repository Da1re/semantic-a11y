export type ReportStatus = 'idle' | 'loading' | 'error' | 'done';

export function toReportStatus(hasTarget: boolean, hasError: boolean, hasData: boolean): ReportStatus {
  if (!hasTarget) return 'idle';
  if (hasError) return 'error';
  if (!hasData) return 'loading';
  return 'done';
}
