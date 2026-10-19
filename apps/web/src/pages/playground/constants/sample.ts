export const SAMPLE_ID = {
  SHOP: 'shop',
  SIGNUP: 'signup',
  NOTICE: 'notice',
} as const;

export type SampleId = (typeof SAMPLE_ID)[keyof typeof SAMPLE_ID];

export const SAMPLE_LABEL: Record<SampleId, { ko: string; en: string }> = {
  shop: { ko: '쇼핑몰 상품 상세', en: 'Shop product page' },
  signup: { ko: '회원가입 폼', en: 'Sign-up form' },
  notice: { ko: '기관 공지·통계', en: 'Public notice and statistics' },
};
