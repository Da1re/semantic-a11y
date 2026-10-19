export const JUDGED_BY = {
  RULE: 'rule',
  AI: 'ai',
} as const;

export type JudgedBy = (typeof JUDGED_BY)[keyof typeof JUDGED_BY];

export const JUDGED_BY_LABEL: Record<JudgedBy, { ko: string; en: string }> = {
  rule: { ko: '규칙', en: 'Rule' },
  ai: { ko: 'AI', en: 'AI' },
};
