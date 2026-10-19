import type { ReviewDecision } from '../store/review-store';

export function toRejectedSet(decisions: Record<string, ReviewDecision>): ReadonlySet<string> {
  const rejected = Object.entries(decisions).filter(([, decision]) => decision.status === 'rejected');
  return new Set(rejected.map(([fingerprint]) => fingerprint));
}
