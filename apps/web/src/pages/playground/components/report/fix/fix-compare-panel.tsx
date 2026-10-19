import { usePlaygroundStore } from '../../../store/use-playground-store';
import { FixComparison } from './fix-comparison';
import { ReportViewToggle } from './report-view-toggle';

export function FixComparePanel() {
  const isSample = usePlaygroundStore((state) => state.auditTarget?.kind === 'sample');
  const fixesApplied = usePlaygroundStore((state) => state.fixesApplied);
  const applyAllFixes = usePlaygroundStore((state) => state.applyAllFixes);
  // 붙여 넣은 HTML은 AI가 연결되지 않아 수정 제안이 없으므로 적용·비교할 것이 없다
  if (!isSample) return null;

  return (
    <section aria-labelledby="fix-compare-title" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
      <h3 id="fix-compare-title" className="font-bold">
        개선 전후 비교
      </h3>
      {fixesApplied ? (
        <>
          <FixComparison />
          <ReportViewToggle />
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate-800">
            제안된 수정 코드를 샘플에 모두 적용한 뒤 같은 기준으로 다시 점검합니다.
          </p>
          <button
            type="button"
            onClick={applyAllFixes}
            className="mt-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            수정 코드 모두 적용하고 다시 점검
          </button>
        </>
      )}
    </section>
  );
}
