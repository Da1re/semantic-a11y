import { useContext } from 'react';
import { useStore } from 'zustand';
import type { ReviewState } from './review-store';
import { ReviewStoreContext } from './review-store-context';

export function useReviewStore<T>(selector: (state: ReviewState) => T): T {
  const store = useContext(ReviewStoreContext);
  if (!store) throw new Error('ReviewStoreProvider 안에서만 쓸 수 있습니다.');
  return useStore(store, selector);
}
