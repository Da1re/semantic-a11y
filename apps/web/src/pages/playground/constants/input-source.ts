export const INPUT_SOURCE = {
  SAMPLE: 'sample',
  HTML: 'html',
} as const;

export type InputSource = (typeof INPUT_SOURCE)[keyof typeof INPUT_SOURCE];

export const INPUT_SOURCE_LABEL: Record<InputSource, { ko: string; en: string }> = {
  sample: { ko: '샘플 페이지', en: 'Sample page' },
  html: { ko: 'HTML 붙여넣기', en: 'Paste HTML' },
};
