import { SEVERITY_LABEL } from '../../../constants/severity';
import type { Violation } from '../../../engine/types';
import { toSourceText, toStandardText } from '../../../models/violation-text';
import { usePlaygroundStore } from '../../../store/use-playground-store';
import { CodeBlock } from './code-block';
import { FixSection } from './fix-section';
import { ReviewNote } from './review-note';

interface ViolationDetailProps {
  violation: Violation;
}

export function ViolationDetail({ violation }: ViolationDetailProps) {
  const locale = usePlaygroundStore((state) => state.locale);
  const meta = [
    ['기준', toStandardText(violation, locale)],
    ['심각도', SEVERITY_LABEL[violation.severity][locale]],
    ['출처', toSourceText(violation, locale)],
  ] as const;

  return (
    <div className="space-y-3 border-t border-slate-200 p-3">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {meta.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-semibold text-slate-700">{label}</dt>
            <dd lang={locale}>{value}</dd>
          </div>
        ))}
      </dl>
      <p lang={locale} className="text-sm whitespace-pre-line text-slate-800">
        {violation.reason[locale]}
      </p>
      {violation.needsReview && <ReviewNote fingerprint={violation.fingerprint} />}
      <CodeBlock label="코드 조각" code={violation.snippet} />
      <FixSection fix={violation.fix} />
    </div>
  );
}
