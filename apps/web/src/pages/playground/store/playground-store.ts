import { createStore } from 'zustand/vanilla';
import type { JudgedBy } from '../constants/judged-by';
import type { ReportLocale } from '../constants/report-locale';
import type { ReportView } from '../constants/report-view';
import type { AuditTarget } from '../models/audit-target';

export interface PlaygroundState {
  auditTarget: AuditTarget | null;
  fixesApplied: boolean;
  view: ReportView;
  locale: ReportLocale;
  highlighted: string | null;
  selected: string | null;
  layers: Record<JudgedBy, boolean>;
  focusMode: boolean;
  startAudit: (target: AuditTarget) => void;
  clearAudit: () => void;
  applyAllFixes: () => void;
  changeView: (view: ReportView) => void;
  changeLocale: (locale: ReportLocale) => void;
  highlight: (fingerprint: string | null) => void;
  toggleSelect: (fingerprint: string) => void;
  toggleLayer: (judgedBy: JudgedBy) => void;
  toggleFocusMode: () => void;
  reset: () => void;
}

type PlaygroundData = Pick<
  PlaygroundState,
  'auditTarget' | 'fixesApplied' | 'view' | 'locale' | 'highlighted' | 'selected' | 'layers' | 'focusMode'
>;

const INITIAL_STATE: PlaygroundData = {
  auditTarget: null,
  fixesApplied: false,
  view: 'original',
  locale: 'ko',
  highlighted: null,
  selected: null,
  layers: { rule: true, ai: true },
  focusMode: false,
};

export function createPlaygroundStore() {
  return createStore<PlaygroundState>()((set) => ({
    ...INITIAL_STATE,
    // 점검 대상이 바뀌면 이전 대상의 수정 적용·선택 상태가 새 결과와 어긋나므로 함께 비운다
    startAudit: (auditTarget) => set({ auditTarget, fixesApplied: false, view: 'original', highlighted: null, selected: null }),
    clearAudit: () => set({ auditTarget: null, fixesApplied: false, view: 'original', highlighted: null, selected: null }),
    applyAllFixes: () => set({ fixesApplied: true, view: 'fixed', highlighted: null, selected: null }),
    // 선택한 위반이 다른 보기에는 없을 수 있어서 선택을 비운다
    changeView: (view) => set({ view, highlighted: null, selected: null }),
    // 언어는 화면 표시만 바꾸므로 다시 점검하지 않고 선택도 유지한다
    changeLocale: (locale) => set({ locale }),
    highlight: (highlighted) => set({ highlighted }),
    toggleSelect: (fingerprint) => set((state) => ({ selected: state.selected === fingerprint ? null : fingerprint })),
    toggleLayer: (judgedBy) => set((state) => ({ layers: { ...state.layers, [judgedBy]: !state.layers[judgedBy] } })),
    toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
    reset: () => set(INITIAL_STATE),
  }));
}

export type PlaygroundStore = ReturnType<typeof createPlaygroundStore>;
