export function MockSummaryLine() {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">mock</span>
      <span className="text-slate-700">
        샘플은 미리 준비한 결과를 보여 줍니다. 내 AI로 판정하거나 Claude API 키를 연결하면 실제 모델이 판정합니다.
      </span>
    </p>
  );
}
