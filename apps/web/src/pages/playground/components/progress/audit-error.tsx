import { useCurrentAudit } from '../../hooks/use-current-audit';

export function AuditError() {
  const { error } = useCurrentAudit();
  return <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">{error?.message}</p>;
}
