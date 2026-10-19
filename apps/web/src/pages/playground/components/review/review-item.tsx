import { SEVERITY_LABEL } from '../../constants/severity';
import type { Violation } from '../../engine/types';
import { toSourceText, toViolationTitle } from '../../models/violation-text';
import { CodeBlock } from '../report/detail/code-block';
import { ReviewActions } from './review-actions';

interface ReviewItemProps {
  violation: Violation;
}

export function ReviewItem({ violation }: ReviewItemProps) {
  return (
    <li className="space-y-3 rounded-lg border border-slate-200 p-4">
      <h3 className="font-semibold">{toViolationTitle(violation, 'ko')}</h3>
      <p className="text-sm text-slate-700">
        {SEVERITY_LABEL[violation.severity].ko} · {toSourceText(violation, 'ko')} · 위치 <code>{violation.selector}</code>
      </p>
      <p className="text-sm text-slate-800">{violation.reason.ko}</p>
      <CodeBlock label="코드 조각" code={violation.snippet} />
      {violation.fix && <CodeBlock label="AI가 제안한 수정 코드" code={violation.fix.after} />}
      <ReviewActions fingerprint={violation.fingerprint} />
    </li>
  );
}
