import { createContext } from 'react';
import type { ReviewStore } from './review-store';

export const ReviewStoreContext = createContext<ReviewStore | null>(null);
