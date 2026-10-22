import { skipToken, useQuery } from '@tanstack/react-query';
import { fingerprint } from '../../engine/fingerprint';
import type { AiConnection } from '../../models/ai-connection';
import type { AuditTarget } from '../../models/audit-target';
import { fetchAudit } from './audit-query';

// HTML 원문은 키에 넣기엔 길어서, 정리된 HTML의 해시로 같은 입력을 알아본다.
// AI 판정은 제공자·모델·이미지 여부까지 키에 넣는다. API 키는 캐시 키에 남으면 안 되므로 넣지 않는다.
// 내 AI의 답은 길어서 해시로 넣고, 답이 없으면 요청만 만든 결과로 구분한다
function toAuditQueryKey(target: AuditTarget | null) {
  const llm = target?.llm;
  const answerKey = llm?.response ? fingerprint([llm.response]) : 'request';
  const judgeKey = llm ? (['llm', llm.provider, llm.model, llm.vision ? 'vision' : 'text', answerKey] as const) : [];
  if (target?.kind === 'html') return ['audit', 'html', target.hash, ...judgeKey] as const;
  return ['audit', 'sample', target?.sampleId ?? null, ...judgeKey] as const;
}

export function useAuditQuery(target: AuditTarget | null, connection: AiConnection | null) {
  return useQuery({
    queryKey: toAuditQueryKey(target),
    queryFn: target === null ? skipToken : () => fetchAudit(target, connection),
    // 키가 같으면 내용과 판정 방식이 같으니 한 번 점검한 결과를 계속 쓴다
    staleTime: Infinity,
    // AI 판정은 호출마다 사용자 돈이 든다. 실패한 점검은 결과가 없어 늘 stale이라, 아래를 끄지 않으면
    // 오류 화면이 새로 마운트되거나 창에 다시 초점이 올 때마다 저절로 다시 호출한다. 재시도는 사용자가 누를 때만 한다
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
