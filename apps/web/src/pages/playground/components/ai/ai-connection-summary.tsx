import { LLM_PROVIDER } from '../../constants/llm-provider';
import type { AiConnection } from '../../models/ai-connection';
import type { RememberStatus } from '../../store/ai-connection-store';
import { useAiConnectionStore } from '../../store/use-ai-connection-store';
import { ApiSummaryLine } from './summary/api-summary-line';
import { ManualSummaryLine } from './summary/manual-summary-line';
import { MockSummaryLine } from './summary/mock-summary-line';

const REMEMBER_TEXT: Record<RememberStatus, string> = {
  none: '',
  saved: '이 탭에 암호화해 기억했습니다. 탭을 닫으면 지워집니다.',
  restored: '이 탭에 기억해 둔 연결을 불러왔습니다.',
  unavailable: '이 브라우저에서는 기억할 수 없어 새로고침하면 다시 연결해야 합니다.',
};

const SUMMARY_LINE = {
  mock: <MockSummaryLine />,
  manual: <ManualSummaryLine />,
  api: <ApiSummaryLine />,
} as const;

function toSummaryKind(connection: AiConnection | null): keyof typeof SUMMARY_LINE {
  if (!connection) return 'mock';
  if (connection.provider === LLM_PROVIDER.MANUAL) return 'manual';
  return 'api';
}

export function AiConnectionSummary() {
  const kind = useAiConnectionStore((state) => toSummaryKind(state.connection));
  const rememberStatus = useAiConnectionStore((state) => state.rememberStatus);

  return (
    <div className="min-w-0 flex-1 text-sm">
      {SUMMARY_LINE[kind]}
      <p role="status" className="mt-1 text-slate-600">
        {REMEMBER_TEXT[rememberStatus]}
      </p>
    </div>
  );
}
