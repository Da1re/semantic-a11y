import { useAuditQuery } from '../../../hooks/query/use-audit-query';
import { useFixedAuditQuery } from '../../../hooks/query/use-fixed-audit-query';
import { toSampleId } from '../../../models/audit-target';
import { compareReports } from '../../../models/compare-reports';
import { usePlaygroundStore } from '../../../store/use-playground-store';

export function FixComparison() {
  const auditTarget = usePlaygroundStore((state) => state.auditTarget);
  const { data: before } = useAuditQuery(auditTarget);
  const { data: after } = useFixedAuditQuery(toSampleId(auditTarget));
  if (!before || !after) return null;

  const { resolved, remaining, added } = compareReports(before, after);
  const items = [
    ['해결', resolved.length],
    ['남음', remaining.length],
    ['새로 생김', added.length],
  ] as const;

  return (
    <div className="mt-2">
      <p className="font-semibold">
        수정 전 {before.violations.length}건 → 수정 후 {after.violations.length}건
      </p>
      <dl className="mt-2 grid grid-cols-3 gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-md bg-white p-2">
            <dt className="text-xs text-slate-600">{label}</dt>
            <dd className="text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
