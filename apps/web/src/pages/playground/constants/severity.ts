export const SEVERITY = {
  CRITICAL: 'critical',
  SERIOUS: 'serious',
  MODERATE: 'moderate',
} as const;

export type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

export const SEVERITY_LABEL: Record<Severity, { ko: string; en: string }> = {
  critical: { ko: '치명', en: 'Critical' },
  serious: { ko: '심각', en: 'Serious' },
  moderate: { ko: '보통', en: 'Moderate' },
};
