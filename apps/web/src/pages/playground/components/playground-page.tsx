const STEPS = ['샘플 페이지 선택 또는 HTML 붙여넣기', '규칙 점검(axe-core)', 'AI 판정 대상 추출 · 의미 판정', '결과 리포트 · 수정 코드'] as const;

export function PlaygroundPage() {
  return (
    <section aria-labelledby="playground-title" className="mx-auto max-w-6xl px-6 py-12">
      <h1 id="playground-title" className="text-3xl font-bold">
        플레이그라운드
      </h1>
      <p className="mt-3 text-slate-700">점검 화면을 만드는 중입니다. 아래 순서로 동작합니다.</p>
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-slate-800">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
