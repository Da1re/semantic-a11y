import { LLM_PROVIDER } from '../../constants/llm-provider';
import { useAiConnectionActions } from '../../hooks/use-ai-connection-actions';
import { useAiConnectionStore } from '../../store/use-ai-connection-store';

export type PanelView = 'manual' | 'key' | 'settings' | null;

interface AiConnectionActionsProps {
  view: PanelView;
  bodyId: string;
  onToggle: (view: Exclude<PanelView, null>) => void;
  onClose: () => void;
}

const PRIMARY = 'h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800';
const SECONDARY = 'h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50';

export function AiConnectionActions({ view, bodyId, onToggle, onClose }: AiConnectionActionsProps) {
  const isConnected = useAiConnectionStore((state) => state.connection !== null);
  const isManual = useAiConnectionStore((state) => state.connection?.provider === LLM_PROVIDER.MANUAL);
  const { disconnect } = useAiConnectionActions();

  if (isConnected) {
    // 내 AI는 키가 없어 "연결"이 아니라 판정 방식을 켜 둔 것이라 설정·끄기 문구를 달리한다
    const settingsView = isManual ? 'manual' : 'settings';
    const offLabel = isManual ? '끄기' : '연결 끊기';
    return (
      <div className="flex gap-2">
        <button
          type="button"
          aria-expanded={view === settingsView}
          aria-controls={bodyId}
          onClick={() => onToggle(settingsView)}
          className={SECONDARY}
        >
          설정
        </button>
        <button
          type="button"
          onClick={() => {
            disconnect();
            onClose();
          }}
          className={SECONDARY}
        >
          {offLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" aria-expanded={view === 'manual'} aria-controls={bodyId} onClick={() => onToggle('manual')} className={PRIMARY}>
        내 AI로 판정
      </button>
      <button type="button" aria-expanded={view === 'key'} aria-controls={bodyId} onClick={() => onToggle('key')} className={SECONDARY}>
        Claude API 키 입력
      </button>
    </div>
  );
}
