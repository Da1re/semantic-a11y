import { JUDGED_BY, JUDGED_BY_LABEL } from '../../../constants/judged-by';
import type { JudgeMode } from '../../../engine/types';
import { useCurrentAudit } from '../../../hooks/use-current-audit';
import { evaluateReport } from '../../../models/evaluate-judgements';
import { hasAiResult } from '../../../models/judge-mode';
import { SAMPLE_CATALOG } from '../../../samples';
import { usePlaygroundStore } from '../../../store/use-playground-store';

const COLUMNS = [
  ['correct', '맞음'],
  ['missed', '놓침'],
  ['falsePositive', '오탐'],
  ['unlabeled', '정답표 밖'],
] as const;

const NOTE: Record<JudgeMode, string> = {
  mock: 'mock 판정은 정답에 맞춰 준비한 결과라 AI 줄이 모두 맞음인 것이 정상입니다. 실제 성능은 AI를 연결해 확인하세요.',
  llm: '요소와 KWCAG 항목이 정답 라벨과 같아야 맞음으로 셉니다. "정답표 밖"은 정답 라벨이 다루지 않은 판정입니다.',
  disconnected: '',
  awaiting: '',
};

// 샘플마다 만든 정답 라벨과 비교해, 판정기가 바뀌어도 같은 잣대로 성능을 본다(수정 적용 보기는 정답이 달라져서 뺀다)
export function AccuracyPanel() {
  const sampleId = usePlaygroundStore((state) => (state.auditTarget?.kind === 'sample' ? state.auditTarget.sampleId : null));
  const isOriginalView = usePlaygroundStore((state) => state.view === 'original');
  const { data } = useCurrentAudit();
  // AI 답이 아직 없으면 AI 줄이 모두 놓침으로 보여 성능으로 오해하므로 숨긴다
  if (!sampleId || !isOriginalView || !data || !hasAiResult(data.judgeMode)) return null;

  const rows = evaluateReport(data, SAMPLE_CATALOG[sampleId].expected);

  return (
    <section aria-labelledby="accuracy-title" className="mt-4 rounded-lg border border-slate-200 p-3">
      <h3 id="accuracy-title" className="font-bold">
        정답 대비
      </h3>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th scope="col" className="py-1 font-semibold">
              판정
            </th>
            {COLUMNS.map(([key, label]) => (
              <th key={key} scope="col" className="py-1 text-right font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(JUDGED_BY).map((judgedBy) => (
            <tr key={judgedBy} className="border-t border-slate-200">
              <th scope="row" className="py-1 text-left font-semibold">
                {JUDGED_BY_LABEL[judgedBy].ko} <span className="font-normal text-slate-600">(라벨 {rows[judgedBy].labels})</span>
              </th>
              {COLUMNS.map(([key]) => (
                <td key={key} className="py-1 text-right tabular-nums">
                  {rows[judgedBy][key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-600">{NOTE[data.judgeMode]}</p>
    </section>
  );
}
