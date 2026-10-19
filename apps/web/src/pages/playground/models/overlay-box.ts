import type { Violation } from '../engine/types';

export interface OverlayBoxData {
  violation: Violation;
  number: number;
  stackIndex: number;
  rect: { top: number; left: number; width: number; height: number };
}

export type Emphasis = 'normal' | 'active' | 'dimmed';

export function toEmphasis(activeFingerprint: string | null, fingerprint: string): Emphasis {
  if (activeFingerprint === null) return 'normal';
  if (activeFingerprint === fingerprint) return 'active';
  return 'dimmed';
}
