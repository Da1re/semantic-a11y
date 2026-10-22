import { LLM_PROVIDER } from '../../constants/llm-provider';
import type { LlmTarget } from '../../models/audit-target';
import { usePlaygroundStore } from '../../store/use-playground-store';

// 실제 모델 호출은 수십 초 걸릴 수 있어서, 멈춘 것으로 오해하지 않게 따로 알린다. 내 AI는 여기서 모델을 부르지 않는다
function toProgressText(llm: LlmTarget | null | undefined): string {
  if (!llm) return 'axe-core 규칙 점검과 AI 판정을 실행하고 있습니다.';
  if (llm.provider === LLM_PROVIDER.MANUAL) return 'axe-core 규칙 점검과 내 AI에 보낼 요청을 준비하고 있습니다.';
  return `axe-core 규칙 점검 뒤 AI(${llm.model})가 판정하고 있습니다. 보통 30초~2분 걸립니다.`;
}

export function AuditProgress() {
  const llm = usePlaygroundStore((state) => state.auditTarget?.llm);
  const text = toProgressText(llm);

  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-slate-700">
      <span
        aria-hidden="true"
        className="size-5 rounded-full border-2 border-slate-300 border-t-blue-700 motion-safe:animate-spin"
      />
      <span>{text}</span>
    </div>
  );
}
