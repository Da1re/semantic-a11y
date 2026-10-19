import { skipToken, useQuery } from '@tanstack/react-query';
import type { AuditTarget } from '../../models/audit-target';
import { fetchAudit } from './audit-query';

// HTML 원문은 키에 넣기엔 길어서, 정리된 HTML의 해시로 같은 입력을 알아본다
function toAuditQueryKey(target: AuditTarget | null) {
  if (target?.kind === 'html') return ['audit', 'html', target.hash] as const;
  return ['audit', 'sample', target?.sampleId ?? null] as const;
}

export function useAuditQuery(target: AuditTarget | null) {
  return useQuery({
    queryKey: toAuditQueryKey(target),
    queryFn: target === null ? skipToken : () => fetchAudit(target),
    // 샘플과 붙여 넣은 HTML 모두 키가 같으면 내용이 같으니 한 번 점검한 결과를 계속 쓴다
    staleTime: Infinity,
    retry: false,
  });
}
