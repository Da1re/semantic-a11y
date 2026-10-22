import { useCurrentAudit } from '../../../hooks/use-current-audit';
import { usePlaygroundStore } from '../../../store/use-playground-store';
import { ManualRequestSteps } from './manual-request-steps';
import { ManualResponseForm } from './manual-response-form';

// 답을 기다릴 때는 펼쳐 두고, 판정을 반영한 뒤에는 접어서 결과를 밀어내지 않는다(다시 보내거나 다른 답을 넣을 때 연다)
export function ManualJudgePanel() {
  const { data } = useCurrentAudit();
  const isOriginalView = usePlaygroundStore((state) => state.view === 'original');
  if (!data?.manualRequest || !isOriginalView) return null;

  const isAwaiting = data.judgeMode === 'awaiting';
  const lead = isAwaiting
    ? '아래 순서대로 내 AI에게 판정을 받아 오면, 같은 검증기와 정답표로 채점해 결과에 더합니다.'
    : '붙여 넣은 답으로 판정했습니다. 요청을 다시 보내거나 다른 답을 넣으려면 펼치세요.';

  return (
    <details open={isAwaiting} className="mt-4 rounded-lg border-2 border-blue-700 bg-blue-50/40 p-4">
      <summary className="cursor-pointer font-bold text-slate-900">내 AI로 판정</summary>
      <p className="mt-2 text-sm text-slate-700">{lead}</p>
      <ManualRequestSteps />
      <ManualResponseForm />
    </details>
  );
}
