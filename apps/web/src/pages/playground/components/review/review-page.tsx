import { Link } from 'react-router';
import { SAMPLE_ID } from '../../constants/sample';
import { ReviewStoreProvider } from '../../store/review-store-provider';
import { ReviewSampleSection } from './review-sample-section';

export function ReviewPage() {
  return (
    <ReviewStoreProvider>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold">검수 대기열</h1>
        <p className="mt-3 text-slate-700">
          AI 신뢰도가 70% 미만인 판정을 모았습니다. 승인하면 리포트에 그대로 싣고, 반려하면 리포트 내보내기에서 뺍니다.
          결정은 이 브라우저에만 저장됩니다.
        </p>
        <p className="mt-2">
          <Link to="/playground" className="font-semibold text-blue-700 underline">
            플레이그라운드로 돌아가기
          </Link>
        </p>
        {Object.values(SAMPLE_ID).map((sampleId) => (
          <ReviewSampleSection key={sampleId} sampleId={sampleId} />
        ))}
      </div>
    </ReviewStoreProvider>
  );
}
