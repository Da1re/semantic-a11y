import { useCurrentAudit } from '../../hooks/use-current-audit';
import { toReportStatus } from '../../models/report-status';
import { usePlaygroundStore } from '../../store/use-playground-store';
import { AuditError } from '../progress/audit-error';
import { AuditProgress } from '../progress/audit-progress';
import { AccuracyPanel } from './accuracy/accuracy-panel';
import { ExportActions } from './export/export-actions';
import { FixComparePanel } from './fix/fix-compare-panel';
import { ManualJudgePanel } from './manual/manual-judge-panel';
import { ReportLocaleToggle } from './report-locale-toggle';
import { ReportSummary } from './report-summary';
import { ViolationList } from './violation-list';

export function ReportPanel() {
  const auditTarget = usePlaygroundStore((state) => state.auditTarget);
  const isFixedView = usePlaygroundStore((state) => state.view === 'fixed');
  const { data, isError } = useCurrentAudit();
  const status = toReportStatus(auditTarget !== null, isError, data !== undefined);

  const body = {
    idle: <p className="mt-4 text-slate-600">샘플을 고르거나 HTML을 붙여 넣고 점검하기를 누르면 결과가 여기에 나옵니다.</p>,
    loading: <AuditProgress />,
    error: <AuditError />,
    done: (
      <>
        <ManualJudgePanel />
        <FixComparePanel />
        <ReportSummary />
        <AccuracyPanel />
        <ReportLocaleToggle />
        <ExportActions />
        <ViolationList />
      </>
    ),
  }[status];
  const doneLead = isFixedView ? '수정 코드를 적용한 페이지의 점검 결과입니다.' : '점검이 끝났습니다.';
  // 상태가 바뀔 때마다 화면낭독기에 알리려면 알림 영역이 처음부터 있어야 한다
  const announcement = {
    idle: '',
    loading: '점검하고 있습니다.',
    error: '점검에 실패했습니다.',
    done: `${doneLead} 위반 ${data?.violations.length ?? 0}건을 찾았습니다.`,
  }[status];

  return (
    <section
      aria-labelledby="report-title"
      className="min-w-0 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)] xl:self-start xl:overflow-y-auto xl:pr-1"
    >
      <h2 id="report-title" className="text-lg font-bold">
        점검 결과
      </h2>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {body}
    </section>
  );
}
