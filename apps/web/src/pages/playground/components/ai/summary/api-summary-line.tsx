import { LLM_PROVIDER_LABEL } from '../../../constants/llm-provider';
import { useAiConnectionStore } from '../../../store/use-ai-connection-store';

export function ApiSummaryLine() {
  const connection = useAiConnectionStore((state) => state.connection);
  if (!connection) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-800">
        <span aria-hidden="true" className="size-2 rounded-full bg-emerald-600" />
        연결됨
      </span>
      <span className="text-slate-800">
        {LLM_PROVIDER_LABEL[connection.provider].ko} · <code className="font-mono text-[0.8125rem]">{connection.model}</code> · 이미지{' '}
        {connection.vision ? '보냄' : '안 보냄'}
      </span>
    </p>
  );
}
