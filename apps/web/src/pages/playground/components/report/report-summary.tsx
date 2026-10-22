import { useCurrentAudit } from '../../hooks/use-current-audit';
import { JudgeMetaNote } from './judge-meta-note';
import { LayerToggles } from './layer-toggles';

export function ReportSummary() {
  const { data } = useCurrentAudit();
  if (!data) return null;

  const { stats, violations, judgeMode } = data;
  const reviewCount = violations.filter((violation) => violation.needsReview).length;
  // AI 판정이 없는데 "AI 위반 0"으로 보이면 문제가 없다고 오해하므로 숫자 대신 상태를 적는다
  const aiValue = { mock: stats.byJudge.ai, llm: stats.byJudge.ai, disconnected: '미연결', awaiting: '답 대기' }[judgeMode];
  const items = [
    ['검사한 요소', stats.checkedElements],
    ['AI 판정 대상', stats.candidates],
    ['규칙 위반', stats.byJudge.rule],
    ['AI 판정 위반', aiValue],
  ] as const;
  const aiSummary = `사람 확인이 필요한 판정 ${reviewCount}건 · AI가 정상으로 본 요소 ${stats.aiPassed}건.`;
  const note = {
    mock: `${aiSummary} 이 데모의 AI 판정은 샘플마다 미리 준비한 결과(mock)입니다.`,
    disconnected: 'AI 미연결: 규칙(axe) 결과만 보여 줍니다. 위의 "AI 판정"에서 내 AI로 판정하거나 Claude API 키를 연결하면 AI가 의미로 판정합니다.',
    llm: aiSummary,
    awaiting: '규칙(axe) 결과만 먼저 보여 줍니다. 위 "내 AI로 판정"의 요청을 내 AI에 보내고 받은 답을 붙여 넣으면 AI 판정이 더해집니다.',
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
      <JudgeMetaNote />
      <LayerToggles />
    </div>
  );
}
