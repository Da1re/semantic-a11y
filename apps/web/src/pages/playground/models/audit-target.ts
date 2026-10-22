import type { LlmProviderId } from '../constants/llm-provider';
import type { SampleId } from '../constants/sample';
import { fingerprint } from '../engine/fingerprint';
import type { AuditFormValues } from './audit-form';

/** 점검할 때 쓸 모델. API 키는 담지 않는다(점검 대상이 그대로 queryKey가 되므로) */
export interface LlmTarget {
  provider: LlmProviderId;
  model: string;
  vision: boolean;
  /** 내 AI로 판정할 때 붙여 넣은 답. 없으면 요청만 만든다 */
  response: string | null;
}

type SourceTarget = { kind: 'sample'; sampleId: SampleId } | { kind: 'html'; html: string; hash: string };

// 점검하기를 누른 순간의 연결을 함께 묶어 둔다. 나중에 연결을 바꿔도 이미 본 결과가 저절로 다시 판정(과금)되지 않게 하려는 것이다
export type AuditTarget = SourceTarget & { llm: LlmTarget | null };

async function toSourceTarget({ source, sampleId, html }: AuditFormValues): Promise<SourceTarget> {
  if (source === 'sample') return { kind: 'sample', sampleId };
  // DOMPurify는 HTML을 붙여 넣을 때만 필요해서, 첫 화면 번들에 넣지 않고 이때 불러온다
  const { sanitizeHtml } = await import('../engine/sanitize-html');
  const sanitized = sanitizeHtml(html);
  return { kind: 'html', html: sanitized, hash: fingerprint([sanitized]) };
}

// 같은 HTML을 다시 점검하면 캐시를 쓰도록, 정리된 HTML로 해시를 만든다
export async function toAuditTarget(values: AuditFormValues, llm: LlmTarget | null): Promise<AuditTarget> {
  return { ...(await toSourceTarget(values)), llm };
}

// 답을 붙여 넣으면 같은 대상을 그 답으로 다시 점검한다. 대상이 바뀌어야 새 결과로 캐시된다
export function withManualResponse(target: AuditTarget, response: string): AuditTarget {
  if (!target.llm) return target;
  return { ...target, llm: { ...target.llm, response } };
}

// 수정 코드 적용·재점검은 수정 제안이 있는 샘플에서만 할 수 있다
export function toSampleId(target: AuditTarget | null): SampleId | null {
  if (target?.kind !== 'sample') return null;
  return target.sampleId;
}
