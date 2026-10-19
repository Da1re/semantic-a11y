import { Link } from 'react-router';
import { REVIEW_STATUS_LABEL } from '../../../constants/review-status';
import { useReviewStore } from '../../../store/use-review-store';

interface ReviewNoteProps {
  fingerprint: string;
}

// 배지는 결정 결과를 보이는데 상세가 "확인 필요"로 남으면 서로 어긋나므로, 결정이 있으면 그 결과를 적는다
export function ReviewNote({ fingerprint }: ReviewNoteProps) {
  const decision = useReviewStore((state) => state.decisions[fingerprint]);
  const message = decision
    ? `검수 결과: ${REVIEW_STATUS_LABEL[decision.status].ko}.`
    : 'AI 신뢰도가 70% 미만이라 사람 확인이 필요합니다.';

  return (
    <p className="rounded-md bg-violet-50 p-2 text-sm text-violet-900">
      {message}{' '}
      <Link to="/playground/review" className="font-semibold underline">
        {decision ? '검수 대기열에서 바꾸기' : '검수 대기열에서 확인'}
      </Link>
    </p>
  );
}
