import type { AiConnection } from '../models/ai-connection';
import { clearConnection, saveConnection } from '../store/connection-vault';
import { useAiConnectionStore } from '../store/use-ai-connection-store';

// 스토어는 메모리 상태만 맡고, 저장소에 암호화해 남기거나 지우는 일은 여기서 함께 처리한다
export function useAiConnectionActions() {
  const connectInStore = useAiConnectionStore((state) => state.connect);
  const disconnectInStore = useAiConnectionStore((state) => state.disconnect);
  const setRememberStatus = useAiConnectionStore((state) => state.setRememberStatus);

  const connect = (connection: AiConnection) => {
    connectInStore(connection);
    // 기억하지 않기로 바꿨다면 예전에 남긴 암호문도 지운다
    if (!connection.remember) {
      clearConnection();
      return;
    }
    void saveConnection(connection).then((saved) => setRememberStatus(saved ? 'saved' : 'unavailable'));
  };

  const disconnect = () => {
    clearConnection();
    disconnectInStore();
  };

  return { connect, disconnect };
}
