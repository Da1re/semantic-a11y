const ROADMAP = [
  { phase: '1단계', title: '웹 플레이그라운드', status: '진행 중' },
  { phase: '2단계', title: 'CLI (npm)', status: '예정' },
  { phase: '3단계', title: 'MCP 서버 (AI 코딩 에이전트 연결)', status: '예정' },
  { phase: '4단계', title: '크롬 확장', status: '예정' },
] as const;

export function RoadmapSection() {
  return (
    <section aria-labelledby="roadmap-title" className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 id="roadmap-title" className="text-2xl font-bold">
          로드맵
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {ROADMAP.map((item) => (
            <li key={item.phase} className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-700">{item.phase}</p>
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.status}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
