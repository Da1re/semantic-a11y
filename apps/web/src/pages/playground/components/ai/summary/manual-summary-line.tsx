import { useAiConnectionStore } from '../../../store/use-ai-connection-store';

export function ManualSummaryLine() {
  const vision = useAiConnectionStore((state) => state.connection?.vision ?? true);

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-800">
        <span aria-hidden="true" className="size-2 rounded-full bg-emerald-600" />내 AI로 판정
      </span>
      <span className="text-slate-800">
        점검하면 결과 패널에 내 AI에 붙여 넣을 요청이 준비됩니다 · 이미지 {vision ? '함께 씀' : '안 씀'}
      </span>
    </p>
  );
}
