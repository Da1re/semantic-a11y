import { toSampleId } from '../models/audit-target';
import { useAiConnectionStore } from '../store/use-ai-connection-store';
import { usePlaygroundStore } from '../store/use-playground-store';
import { useAuditQuery } from './query/use-audit-query';
import { useFixedAuditQuery } from './query/use-fixed-audit-query';

// 오버레이·요약·목록이 같은 점검 결과를 각자 읽게 해서, 결과를 props로 내려보내지 않는다
export function useCurrentAudit() {
  const auditTarget = usePlaygroundStore((state) => state.auditTarget);
  const fixesApplied = usePlaygroundStore((state) => state.fixesApplied);
  const view = usePlaygroundStore((state) => state.view);
  const connection = useAiConnectionStore((state) => state.connection);
  const original = useAuditQuery(auditTarget, connection);
  // 재점검은 사용자가 "수정 적용"을 눌렀을 때만 돈다. 원본 결과에 걸지 않아서 두 쿼리가 서로 기다리지 않는다
  const fixed = useFixedAuditQuery(fixesApplied ? toSampleId(auditTarget) : null);
  return view === 'fixed' ? fixed : original;
}
