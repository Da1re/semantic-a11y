import { SAMPLE_LABEL, type SampleId } from '../../constants/sample';
import { SAMPLE_CATALOG } from '../../samples';
import { ReviewSampleItems } from './review-sample-items';

interface ReviewSampleSectionProps {
  sampleId: SampleId;
}

export function ReviewSampleSection({ sampleId }: ReviewSampleSectionProps) {
  const titleId = `review-${sampleId}-title`;

  return (
    <section aria-labelledby={titleId} className="mt-10">
      <h2 id={titleId} className="text-xl font-bold">
        {SAMPLE_LABEL[sampleId].ko}{' '}
        <span className="text-base font-normal text-slate-600">{SAMPLE_CATALOG[sampleId].site}</span>
      </h2>
      <ReviewSampleItems sampleId={sampleId} />
    </section>
  );
}
