import { useContext } from 'react';
import { useStore } from 'zustand';
import type { AiConnectionState } from './ai-connection-store';
import { AiConnectionStoreContext } from './ai-connection-store-context';

export function useAiConnectionStore<T>(selector: (state: AiConnectionState) => T): T {
  const store = useContext(AiConnectionStoreContext);
  if (!store) throw new Error('AiConnectionStoreProvider 안에서만 쓸 수 있습니다.');
  return useStore(store, selector);
}
