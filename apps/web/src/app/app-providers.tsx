import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // 렌더마다 새 클라이언트가 생기지 않도록 최초 1회만 만든다
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
