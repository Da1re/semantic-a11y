import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type ReviewDecision = { status: 'approved' } | { status: 'rejected'; reason: string };

export interface ReviewState {
  /** 지문 → 사람의 결정. 판정 내용은 점검 결과(React Query)에 있으므로 결정만 저장한다 */
  decisions: Record<string, ReviewDecision>;
  approve: (fingerprint: string) => void;
  reject: (fingerprint: string, reason: string) => void;
  undo: (fingerprint: string) => void;
  reset: () => void;
}

const INITIAL_DECISIONS: ReviewState['decisions'] = {};

// 플레이그라운드와 검수 페이지가 각자 Provider를 두되 같은 키를 읽어서, 라우터를 건드리지 않고 결정을 공유한다
export function createReviewStore() {
  return createStore<ReviewState>()(
    persist(
      (set) => ({
        decisions: INITIAL_DECISIONS,
        approve: (fingerprint) =>
          set((state) => ({ decisions: { ...state.decisions, [fingerprint]: { status: 'approved' } } })),
        reject: (fingerprint, reason) =>
          set((state) => ({ decisions: { ...state.decisions, [fingerprint]: { status: 'rejected', reason } } })),
        undo: (fingerprint) =>
          set((state) => ({
            decisions: Object.fromEntries(Object.entries(state.decisions).filter(([key]) => key !== fingerprint)),
          })),
        reset: () => set({ decisions: INITIAL_DECISIONS }),
      }),
      { name: 'semantic-a11y:review', version: 1, partialize: (state) => ({ decisions: state.decisions }) },
    ),
  );
}

export type ReviewStore = ReturnType<typeof createReviewStore>;
