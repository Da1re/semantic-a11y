import { useCurrentAudit } from '../../hooks/use-current-audit';
import { LayerToggles } from './layer-toggles';

export function ReportSummary() {
  const { data } = useCurrentAudit();
  if (!data) return null;

  const { stats, violations, judgeMode } = data;
  const reviewCount = violations.filter((violation) => violation.needsReview).length;
  const isDisconnected = judgeMode === 'disconnected';
  // AI가 연결되지 않았는데 "AI 위반 0"으로 보이면 문제가 없다고 오해하므로 숫자 대신 미연결로 적는다
  const items = [
    ['검사한 요소', stats.checkedElements],
    ['AI 판정 대상', stats.candidates],
    ['규칙 위반', stats.byJudge.rule],
    ['AI 판정 위반', isDisconnected ? '미연결' : stats.byJudge.ai],
  ] as const;
  const aiSummary = `사람 확인이 필요한 판정 ${reviewCount}건 · AI가 정상으로 본 요소 ${stats.aiPassed}건.`;
  const note = {
    mock: `${aiSummary} 이 데모의 AI 판정은 샘플마다 미리 준비한 결과(mock)입니다.`,
    disconnected: 'AI 미연결: 규칙(axe) 결과만 보여 줍니다. AI 의미 판정은 MCP 연결 단계에서 제공합니다.',
    llm: aiSummary,
  }[judgeMode];

  return (
    <div className="mt-4 space-y-4">
      <dl className="grid grid-cols-2 gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <dt className="text-sm text-slate-600">{label}</dt>
            <dd className="text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-slate-700">{note}</p>
      <LayerToggles />
    </div>
  );
}
