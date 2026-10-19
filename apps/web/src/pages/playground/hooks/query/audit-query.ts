import type { SampleId } from '../../constants/sample';
import { auditHtml } from '../../engine/audit-html';
import { createDisconnectedJudge } from '../../engine/judge/disconnected-judge';
import { createMockJudge } from '../../engine/judge/mock-judge';
import type { AuditReport } from '../../engine/types';
import type { AuditTarget } from '../../models/audit-target';
import { SAMPLE_CATALOG, toFixedSampleHtml } from '../../samples';

async function withAuditError(run: () => Promise<AuditReport>): Promise<AuditReport> {
  try {
    return await run();
  } catch (cause) {
    throw new Error('점검을 실행하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.', { cause });
  }
}

function runAudit(target: AuditTarget): Promise<AuditReport> {
  if (target.kind === 'html') return auditHtml(target.html, { kind: 'html', hash: target.hash }, createDisconnectedJudge());
  const sample = SAMPLE_CATALOG[target.sampleId];
  return auditHtml(sample.html, { kind: 'sample', sampleId: target.sampleId }, createMockJudge(sample.judgements));
}

export function fetchAudit(target: AuditTarget): Promise<AuditReport> {
  return withAuditError(() => runAudit(target));
}

// 원본과 같은 source를 써야 지문이 같아져 수정 전후를 비교할 수 있다
export function fetchFixedSampleAudit(sampleId: SampleId): Promise<AuditReport> {
  const sample = SAMPLE_CATALOG[sampleId];
  return withAuditError(() =>
    auditHtml(toFixedSampleHtml(sampleId), { kind: 'sample', sampleId }, createMockJudge(sample.judgements)),
  );
}
