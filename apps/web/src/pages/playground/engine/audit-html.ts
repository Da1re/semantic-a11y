import type { AxeResults } from 'axe-core';
import { mountAuditFrame } from './audit-frame';
import { extractCandidates } from './extract-candidates';
import type { Judge, RuleTarget } from './judge/judge';
import { runAxe } from './run-axe';
import { toSnippet } from './snippet';
import { sortByDocument } from './sort-by-document';
import { toAiViolations } from './to-ai-violations';
import { toRuleViolations } from './to-rule-violations';
import type { AuditReport, AuditSource } from './types';

function toSourceKey(source: AuditSource): string {
  if (source.kind === 'sample') return `sample:${source.sampleId}`;
  return `html:${source.hash}`;
}

// to-rule-violations와 같은 선택자 형식이어야 AI가 낸 수정 코드가 해당 위반에 붙는다
function toRuleTargets(results: AxeResults): RuleTarget[] {
  return results.violations.flatMap((rule) =>
    rule.nodes.map((node) => ({ selector: node.target.flat().join(' '), ruleId: rule.id, html: toSnippet(node.html) })),
  );
}

export async function auditHtml(html: string, source: AuditSource, judge: Judge): Promise<AuditReport> {
  const frame = await mountAuditFrame(html);
  try {
    const sourceKey = toSourceKey(source);
    const axeResults = await runAxe(frame);
    const candidates = extractCandidates(frame.doc);
    const ruleTargets = toRuleTargets(axeResults);
    const judgeInput = { doc: frame.doc, candidates, html, ruleViolations: ruleTargets };
    const { judgements, ruleFixes, meta, manualRequest } = await judge.judge(judgeInput);
    const ruleViolations = await toRuleViolations(axeResults, ruleFixes, sourceKey);
    const aiViolations = toAiViolations(judgements, frame.doc, sourceKey);
    return {
      source,
      judgeMode: judge.mode,
      judgeMeta: meta,
      manualRequest,
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
