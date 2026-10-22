import { useCurrentAudit } from '../../hooks/use-current-audit';

export function AuditError() {
  const { error, refetch, isFetching } = useCurrentAudit();

  return (
    <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
      <p>{error?.message}</p>
      {/* 실패한 점검은 저절로 다시 돌지 않게 막아 두었으므로(AI 호출 비용), 다시 시도는 여기서 직접 누른다 */}
      <button
        type="button"
        onClick={() => void refetch()}
        disabled={isFetching}
        className="mt-3 rounded-lg border border-red-800 bg-white px-4 py-2 text-sm font-semibold hover:bg-red-100 disabled:opacity-60"
      >
        {isFetching ? '다시 점검하는 중' : '다시 시도'}
      </button>
    </div>
  );
}
