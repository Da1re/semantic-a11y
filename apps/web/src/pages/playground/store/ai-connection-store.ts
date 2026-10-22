import { createStore } from 'zustand/vanilla';
import type { AiConnection } from '../models/ai-connection';

/** saved: 이 탭에 암호화해 기억함, restored: 기억한 연결을 불러옴, unavailable: 이 브라우저에선 기억할 수 없음 */
export type RememberStatus = 'none' | 'saved' | 'restored' | 'unavailable';

export interface AiConnectionState {
  /** API 키를 포함한다. 기본은 메모리에만 있고 새로고침하면 사라진다 */
  connection: AiConnection | null;
  rememberStatus: RememberStatus;
  connect: (connection: AiConnection) => void;
  restore: (connection: AiConnection) => void;
  disconnect: () => void;
  setRememberStatus: (status: RememberStatus) => void;
  reset: () => void;
}

type AiConnectionData = Pick<AiConnectionState, 'connection' | 'rememberStatus'>;

const INITIAL_STATE: AiConnectionData = { connection: null, rememberStatus: 'none' };

// 키를 화면 밖 전역에 두지 않으려고 플레이그라운드 페이지 단위로 만든다. 다른 페이지로 가면 함께 사라진다
export function createAiConnectionStore() {
  return createStore<AiConnectionState>()((set) => ({
    ...INITIAL_STATE,
    connect: (connection) => set({ connection, rememberStatus: 'none' }),
    restore: (connection) => set({ connection, rememberStatus: 'restored' }),
    disconnect: () => set(INITIAL_STATE),
    setRememberStatus: (rememberStatus) => set({ rememberStatus }),
    reset: () => set(INITIAL_STATE),
  }));
}

export type AiConnectionStore = ReturnType<typeof createAiConnectionStore>;
