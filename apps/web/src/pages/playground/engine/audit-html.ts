import { mountAuditFrame } from './audit-frame';
import { extractCandidates } from './extract-candidates';
import type { Judge } from './judge/judge';
import { runAxe } from './run-axe';
import { sortByDocument } from './sort-by-document';
import { toAiViolations } from './to-ai-violations';
import { toRuleViolations } from './to-rule-violations';
import type { AuditReport, AuditSource } from './types';

function toSourceKey(source: AuditSource): string {
  if (source.kind === 'sample') return `sample:${source.sampleId}`;
  return `html:${source.hash}`;
}

export async function auditHtml(html: string, source: AuditSource, judge: Judge): Promise<AuditReport> {
  const frame = await mountAuditFrame(html);
  try {
    const sourceKey = toSourceKey(source);
    const axeResults = await runAxe(frame);
    const candidates = extractCandidates(frame.doc);
    const { judgements, ruleFixes } = await judge.judge({ doc: frame.doc, candidates, html });
    const ruleViolations = await toRuleViolations(axeResults, ruleFixes, sourceKey);
    const aiViolations = toAiViolations(judgements, frame.doc, sourceKey);
    return {
      source,
      judgeMode: judge.mode,
      violations: sortByDocument([...ruleViolations, ...aiViolations], frame.doc),
      stats: {
        checkedElements: frame.doc.querySelectorAll('body *').length,
        candidates: candidates.length,
        aiPassed: judgements.filter((j) => j.verdict === 'pass').length,
        byJudge: { rule: ruleViolations.length, ai: aiViolations.length },
      },
    };
  } finally {
    frame.remove();
  }
}
