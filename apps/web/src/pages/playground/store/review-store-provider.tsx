import { useState, type ReactNode } from 'react';
import { createReviewStore } from './review-store';
import { ReviewStoreContext } from './review-store-context';

interface ReviewStoreProviderProps {
  children: ReactNode;
}

// 페이지마다 새로 만들어도 저장소에서 결정을 다시 읽으므로, 다른 페이지에서 바꾼 결정이 반영된다
export function ReviewStoreProvider({ children }: ReviewStoreProviderProps) {
  const [store] = useState(createReviewStore);
  return <ReviewStoreContext value={store}>{children}</ReviewStoreContext>;
}
