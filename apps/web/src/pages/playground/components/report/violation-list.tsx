import { useCurrentAudit } from '../../hooks/use-current-audit';
import { ViolationItem } from './violation-item';

export function ViolationList() {
  const { data } = useCurrentAudit();
  if (!data) return null;

  return (
    <section aria-labelledby="violations-title" className="mt-6">
      <h3 id="violations-title" className="font-bold">
        위반 {data.violations.length}건
      </h3>
      <p className="mt-1 text-sm text-slate-600">항목을 누르면 미리보기에서 해당 위치로 이동합니다.</p>
      <ol className="mt-3 space-y-2">
        {data.violations.map((violation, index) => (
          <ViolationItem key={violation.fingerprint} violation={violation} number={index + 1} />
        ))}
      </ol>
    </section>
  );
}
