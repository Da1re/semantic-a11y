import { SAMPLE_CATALOG, toFixedSampleHtml } from '../samples';
import { SAMPLE_LABEL, type SampleId } from '../constants/sample';
import type { AuditTarget } from './audit-target';
import { toPreviewHtml } from './preview-html';

export interface PreviewSource {
  title: string;
  address: string;
  html: string;
  isFixedView: boolean;
}

export function toSamplePreview(sampleId: SampleId, isFixedView: boolean): PreviewSource {
  const { site, html } = SAMPLE_CATALOG[sampleId];
  // 샘플을 바꾸면 수정 적용 상태가 풀리므로, 수정 후 보기는 늘 지금 고른 샘플의 수정본이다
  const source = isFixedView ? toFixedSampleHtml(sampleId) : html;
  const title = `${SAMPLE_LABEL[sampleId].ko} ${isFixedView ? '수정본 미리보기' : '미리보기'}`;
  return { title, address: `https://${site}`, html: toPreviewHtml(source), isFixedView };
}

// 점검 전 원문을 그대로 띄우면 정리되지 않은 HTML이 화면에 그려지므로, 점검(정리) 후에만 보여 준다
export function toPastedPreview(target: AuditTarget | null): PreviewSource | null {
  if (target?.kind !== 'html') return null;
  return { title: '붙여 넣은 HTML 미리보기', address: '붙여 넣은 HTML', html: toPreviewHtml(target.html), isFixedView: false };
}
