export function AuditProgress() {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-slate-700">
      <span
        aria-hidden="true"
        className="size-5 rounded-full border-2 border-slate-300 border-t-blue-700 motion-safe:animate-spin"
      />
      <span>axe-core 규칙 점검과 AI 판정을 실행하고 있습니다.</span>
    </div>
  );
}
