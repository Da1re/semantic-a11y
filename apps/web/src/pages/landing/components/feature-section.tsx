const FEATURES = [
  {
    title: '의미까지 판정',
    body: 'alt가 "있는지"가 아니라 이미지 내용과 "맞는지"를 봅니다. 규칙 엔진이 통과시킨 항목을 AI가 다시 판정합니다.',
  },
  {
    title: 'KWCAG 2.2 · WCAG 매핑',
    body: '모든 결과를 KWCAG 검사항목 번호와 WCAG 성공기준에 함께 연결하고, 한국어·영어 리포트로 내보냅니다.',
  },
  {
    title: '확신이 낮으면 사람에게',
    body: '판정마다 근거와 신뢰도를 붙이고, 애매한 항목은 검수 대기열로 보내 사람이 승인하거나 반려합니다.',
  },
] as const;

export function FeatureSection() {
  return (
    <section aria-labelledby="feature-title" className="mx-auto max-w-6xl px-6 py-16">
      <h2 id="feature-title" className="text-2xl font-bold">
        무엇이 다른가요
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-slate-700">{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
