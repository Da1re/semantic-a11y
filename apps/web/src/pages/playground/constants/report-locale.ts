export const REPORT_LOCALE = {
  KO: 'ko',
  EN: 'en',
} as const;

export type ReportLocale = (typeof REPORT_LOCALE)[keyof typeof REPORT_LOCALE];

export const REPORT_LOCALE_LABEL: Record<ReportLocale, { ko: string; en: string }> = {
  ko: { ko: '한국어', en: 'Korean' },
  en: { ko: '영어', en: 'English' },
};
