import type { SampleId } from '../constants/sample';
import { applyFixes } from '../engine/apply-fixes';
import type { Fix } from '../engine/types';
import { SAMPLE_CATALOG } from './sample-catalog';

// 첫 점검 결과에 의존하지 않도록 고칠 목록을 샘플의 판정 파일에서 바로 만든다
export function toSampleFixes(sampleId: SampleId): Fix[] {
  const { judgements, ruleFixes } = SAMPLE_CATALOG[sampleId].judgements;
  const judgementFixes = judgements.filter((j) => j.verdict === 'fail').flatMap((j) => (j.fix ? [j.fix] : []));
  return [...ruleFixes.map((ruleFix) => ruleFix.fix), ...judgementFixes];
}

export function toFixedSampleHtml(sampleId: SampleId): string {
  return applyFixes(SAMPLE_CATALOG[sampleId].html, toSampleFixes(sampleId));
}
