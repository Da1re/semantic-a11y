import { useState, type ReactNode } from 'react';
import { createPlaygroundStore } from './playground-store';
import { PlaygroundStoreContext } from './playground-store-context';

interface PlaygroundStoreProviderProps {
  children: ReactNode;
}

// 페이지를 떠났다 돌아오면 선택·레이어 상태가 초기화되도록 전역이 아니라 페이지 단위로 스토어를 만든다
export function PlaygroundStoreProvider({ children }: PlaygroundStoreProviderProps) {
  const [store] = useState(createPlaygroundStore);
  return <PlaygroundStoreContext value={store}>{children}</PlaygroundStoreContext>;
}
