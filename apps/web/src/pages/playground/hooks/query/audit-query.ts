import { LLM_PROVIDER } from '../../constants/llm-provider';
import type { SampleId } from '../../constants/sample';
import { auditHtml } from '../../engine/audit-html';
import { createDisconnectedJudge } from '../../engine/judge/disconnected-judge';
import type { Judge } from '../../engine/judge/judge';
import { LlmError } from '../../engine/judge/llm-error';
import { createMockJudge } from '../../engine/judge/mock-judge';
import type { AuditReport } from '../../engine/types';
import type { AiConnection } from '../../models/ai-connection';
import type { AuditTarget, LlmTarget } from '../../models/audit-target';
import { SAMPLE_CATALOG, toFixedSampleHtml } from '../../samples';

// AI 호출 실패는 "키 확인", "한도 초과"처럼 사용자가 할 일이 달라서 문구를 그대로 보여 준다
function toAuditError(cause: unknown): Error {
  if (cause instanceof LlmError) return cause;
  return new Error('점검을 실행하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.', { cause });
}

function withAuditError(run: () => Promise<AuditReport>): Promise<AuditReport> {
  return run().catch((cause: unknown) => {
    throw toAuditError(cause);
  });
}

async function createConnectedJudge(llm: LlmTarget, connection: AiConnection | null): Promise<Judge> {
  const { provider } = llm;
  // 점검 대상에는 키가 없어서, 그사이 연결을 끊었거나 제공자를 바꿨으면 이 결과를 다시 만들 수 없다
  if (provider === LLM_PROVIDER.MANUAL || connection?.provider !== provider) {
    throw new LlmError('AI 연결이 끊겼거나 바뀌었습니다. AI 연결을 확인한 뒤 다시 점검해 주세요.');
  }
  // 기준서·제공자 어댑터는 AI를 연결한 사람만 쓰므로 첫 화면 번들에 넣지 않고 이때 불러온다
  const { createLlmJudge } = await import('../../engine/judge/llm-judge');
  return createLlmJudge({ provider, model: llm.model, vision: llm.vision, apiKey: connection.apiKey });
}

// 내 AI는 키가 필요 없어서 연결 상태와 상관없이 점검 대상에 담긴 답만으로 다시 만들 수 있다
async function createManualJudgeFor(llm: LlmTarget): Promise<Judge> {
  const { createManualJudge } = await import('../../engine/judge/manual/manual-judge');
  return createManualJudge({ vision: llm.vision, response: llm.response });
}

function toJudge(target: AuditTarget, connection: AiConnection | null): Judge | Promise<Judge> {
  const { llm } = target;
  if (llm?.provider === LLM_PROVIDER.MANUAL) return createManualJudgeFor(llm);
  if (llm) return createConnectedJudge(llm, connection);
  if (target.kind === 'html') return createDisconnectedJudge();
  return createMockJudge(SAMPLE_CATALOG[target.sampleId].judgements);
}

// 연결 확인 실패도 거부된 Promise로 모이게 async로 둔다
async function runAudit(target: AuditTarget, connection: AiConnection | null): Promise<AuditReport> {
  const judge = await toJudge(target, connection);
  if (target.kind === 'html') return auditHtml(target.html, { kind: 'html', hash: target.hash }, judge);
  return auditHtml(SAMPLE_CATALOG[target.sampleId].html, { kind: 'sample', sampleId: target.sampleId }, judge);
}

export function fetchAudit(target: AuditTarget, connection: AiConnection | null): Promise<AuditReport> {
  return withAuditError(() => runAudit(target, connection));
}

// 원본과 같은 source를 써야 지문이 같아져 수정 전후를 비교할 수 있다
export function fetchFixedSampleAudit(sampleId: SampleId): Promise<AuditReport> {
  const sample = SAMPLE_CATALOG[sampleId];
  return withAuditError(() =>
    auditHtml(toFixedSampleHtml(sampleId), { kind: 'sample', sampleId }, createMockJudge(sample.judgements)),
  );
}
