import { createContext } from 'react';
import type { AiConnectionStore } from './ai-connection-store';

export const AiConnectionStoreContext = createContext<AiConnectionStore | null>(null);
