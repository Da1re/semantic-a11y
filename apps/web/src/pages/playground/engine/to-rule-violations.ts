import type { AxeResults, ImpactValue, NodeResult, Result } from 'axe-core';
import type { Severity } from '../constants/severity';
import { fingerprint } from './fingerprint';
import type { RuleFix } from './judge/judge';
import { kwcagFromAxe, wcagFromTags } from './map-to-kwcag';
import { toSnippet } from './snippet';
import type { Violation } from './types';

interface RuleContext {
  koHelp: Record<string, { help: string } | undefined>;
  ruleFixes: RuleFix[];
  sourceKey: string;
}

const SEVERITY_BY_IMPACT: Partial<Record<NonNullable<ImpactValue>, Severity>> = {
  critical: 'critical',
  serious: 'serious',
};

function toViolation(rule: Result, node: NodeResult, ctx: RuleContext): Violation {
  const selector = node.target.flat().join(' ');
  const kwcag = kwcagFromAxe(rule.id, rule.tags);
  const impact = node.impact ?? rule.impact;
  return {
    fingerprint: fingerprint([ctx.sourceKey, kwcag ?? rule.id, selector]),
    kwcag,
    wcag: wcagFromTags(rule.tags),
    severity: (impact && SEVERITY_BY_IMPACT[impact]) ?? 'moderate',
    judgedBy: 'rule',
    ruleId: rule.id,
    needsReview: false,
    selector,
    snippet: toSnippet(node.html),
    reason: { ko: ctx.koHelp[rule.id]?.help ?? rule.help, en: rule.help },
    fix: ctx.ruleFixes.find((f) => f.ruleId === rule.id && f.selector === selector)?.fix,
  };
}

export async function toRuleViolations(results: AxeResults, ruleFixes: RuleFix[], sourceKey: string): Promise<Violation[]> {
  const { default: ko } = await import('axe-core/locales/ko.json');
  const ctx: RuleContext = { koHelp: ko.rules, ruleFixes, sourceKey };
  return results.violations.flatMap((rule) => rule.nodes.map((node) => toViolation(rule, node, ctx)));
}
