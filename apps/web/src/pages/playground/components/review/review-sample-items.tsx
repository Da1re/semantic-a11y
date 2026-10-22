import type { SampleId } from '../../constants/sample';
import { useAuditQuery } from '../../hooks/query/use-audit-query';
import { ReviewItem } from './review-item';

interface ReviewSampleItemsProps {
  sampleId: SampleId;
}

// 직접 점검 쿼리를 불러서, 플레이그라운드에서 이미 점검한 샘플은 캐시를 그대로 쓴다.
// 검수 대기열은 AI 연결 없이 샘플의 mock 판정만 모은다(키를 이 페이지까지 들고 오지 않는다)
export function ReviewSampleItems({ sampleId }: ReviewSampleItemsProps) {
  const { data, error } = useAuditQuery({ kind: 'sample', sampleId, llm: null }, null);
  if (error) return <p className="mt-3 rounded-lg bg-red-50 p-3 text-red-800">{error.message}</p>;
  if (!data) return <p className="mt-3 text-slate-700">점검하고 있습니다.</p>;

  const items = data.violations.filter((violation) => violation.needsReview);
  if (items.length === 0) return <p className="mt-3 text-slate-700">확인이 필요한 판정이 없습니다.</p>;

  return (
    <ol className="mt-4 space-y-4">
      {items.map((violation) => (
        <ReviewItem key={violation.fingerprint} violation={violation} />
      ))}
    </ol>
  );
}
