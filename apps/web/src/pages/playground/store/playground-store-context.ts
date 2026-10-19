import { createContext } from 'react';
import type { PlaygroundStore } from './playground-store';

export const PlaygroundStoreContext = createContext<PlaygroundStore | null>(null);
