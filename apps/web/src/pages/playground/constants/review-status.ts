export const REVIEW_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, { ko: string; en: string }> = {
  approved: { ko: '승인됨', en: 'Approved' },
  rejected: { ko: '반려됨', en: 'Rejected' },
};
