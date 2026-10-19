import type { SampleId } from '../constants/sample';
import { fingerprint } from '../engine/fingerprint';
import type { AuditFormValues } from './audit-form';

export type AuditTarget = { kind: 'sample'; sampleId: SampleId } | { kind: 'html'; html: string; hash: string };

// 같은 HTML을 다시 점검하면 캐시를 쓰도록, 정리된 HTML로 해시를 만든다
export async function toAuditTarget({ source, sampleId, html }: AuditFormValues): Promise<AuditTarget> {
  if (source === 'sample') return { kind: 'sample', sampleId };
  // DOMPurify는 HTML을 붙여 넣을 때만 필요해서, 첫 화면 번들에 넣지 않고 이때 불러온다
  const { sanitizeHtml } = await import('../engine/sanitize-html');
  const sanitized = sanitizeHtml(html);
  return { kind: 'html', html: sanitized, hash: fingerprint([sanitized]) };
}

// 수정 코드 적용·재점검은 수정 제안이 있는 샘플에서만 할 수 있다
export function toSampleId(target: AuditTarget | null): SampleId | null {
  if (target?.kind !== 'sample') return null;
  return target.sampleId;
}
