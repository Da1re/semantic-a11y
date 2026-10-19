export const REPORT_VIEW = {
  ORIGINAL: 'original',
  FIXED: 'fixed',
} as const;

export type ReportView = (typeof REPORT_VIEW)[keyof typeof REPORT_VIEW];

export const REPORT_VIEW_LABEL: Record<ReportView, { ko: string; en: string }> = {
  original: { ko: '수정 전', en: 'Before fixes' },
  fixed: { ko: '수정 후', en: 'After fixes' },
};
