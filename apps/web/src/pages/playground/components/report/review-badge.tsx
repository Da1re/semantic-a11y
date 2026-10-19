import { REVIEW_STATUS_LABEL, type ReviewStatus } from '../../constants/review-status';
import { useReviewStore } from '../../store/use-review-store';

const STATUS_STYLE: Record<ReviewStatus, string> = {
  approved: 'bg-emerald-100 text-emerald-900',
  rejected: 'bg-slate-200 text-slate-900 line-through',
};

interface ReviewBadgeProps {
  fingerprint: string;
  needsReview: boolean;
}

// 사람이 이미 결정한 판정은 "사람 확인" 대신 결정 결과를 보여 준다
export function ReviewBadge({ fingerprint, needsReview }: ReviewBadgeProps) {
  const status = useReviewStore((state) => state.decisions[fingerprint]?.status);
  if (status) return <span className={`rounded px-1.5 py-0.5 ${STATUS_STYLE[status]}`}>{REVIEW_STATUS_LABEL[status].ko}</span>;
  if (!needsReview) return null;
  return <span className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-900">사람 확인</span>;
}
