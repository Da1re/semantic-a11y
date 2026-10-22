import { useState, type ReactNode } from 'react';
import { createAiConnectionStore } from './ai-connection-store';
import { AiConnectionStoreContext } from './ai-connection-store-context';

interface AiConnectionStoreProviderProps {
  children: ReactNode;
}

export function AiConnectionStoreProvider({ children }: AiConnectionStoreProviderProps) {
  const [store] = useState(createAiConnectionStore);
  return <AiConnectionStoreContext value={store}>{children}</AiConnectionStoreContext>;
}
