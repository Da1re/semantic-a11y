import { useExportReport } from '../../../hooks/use-export-report';

const BUTTON_CLASS =
  'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-500';

export function ExportActions() {
  const { exportJson, exportMarkdown, printPdf, message } = useExportReport();

  return (
    <section aria-labelledby="export-title" className="mt-4 rounded-lg border border-slate-200 p-3">
      <h3 id="export-title" className="text-sm font-semibold">
        리포트 내보내기
      </h3>
      <p className="mt-1 text-xs text-slate-600">
        Markdown과 PDF는 위에서 고른 언어로, JSON은 한·영 근거를 모두 담아 지금 보는 결과를 내보냅니다.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={exportJson} className={BUTTON_CLASS}>
          JSON 내려받기
        </button>
        <button type="button" onClick={exportMarkdown} className={BUTTON_CLASS}>
          Markdown 내려받기
        </button>
        <button type="button" onClick={printPdf} className={BUTTON_CLASS}>
          PDF로 인쇄
        </button>
      </div>
      <p role="status" className="mt-2 text-sm text-slate-700">
        {message}
      </p>
    </section>
  );
}
