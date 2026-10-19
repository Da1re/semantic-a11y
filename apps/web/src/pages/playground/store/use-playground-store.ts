import { useContext } from 'react';
import { useStore } from 'zustand';
import type { PlaygroundState } from './playground-store';
import { PlaygroundStoreContext } from './playground-store-context';

export function usePlaygroundStore<T>(selector: (state: PlaygroundState) => T): T {
  const store = useContext(PlaygroundStoreContext);
  if (!store) throw new Error('PlaygroundStoreProvider 안에서만 쓸 수 있습니다.');
  return useStore(store, selector);
}
