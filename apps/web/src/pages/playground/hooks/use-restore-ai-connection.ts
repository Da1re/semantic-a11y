import { useEffect } from 'react';
import { loadConnection } from '../store/connection-vault';
import { useAiConnectionStore } from '../store/use-ai-connection-store';

// "이 탭에 기억"을 켜 둔 연결이 있으면 새로고침 뒤에 되살린다. 사용자가 그새 직접 연결했다면 덮어쓰지 않는다
export function useRestoreAiConnection() {
  const restore = useAiConnectionStore((state) => state.restore);
  const hasConnection = useAiConnectionStore((state) => state.connection !== null);

  useEffect(() => {
    if (hasConnection) return;
    let active = true;
    void loadConnection().then((connection) => {
      if (active && connection) restore(connection);
    });
    return () => {
      active = false;
    };
  }, [hasConnection, restore]);
}
