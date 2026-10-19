import { useState } from 'react';
import type { AuditReport, AuditSource } from '../engine/types';
import { toReportDocument, toReportJson, type ReportContext } from '../models/report-document';
import { toRejectedSet } from '../models/review-decision';
import { toMarkdown } from '../models/to-markdown';
import { toPrintHtml } from '../models/to-print-html';
import { usePlaygroundStore } from '../store/use-playground-store';
import { useReviewStore } from '../store/use-review-store';
import { useCurrentAudit } from './use-current-audit';

type ExportRun = (report: AuditReport, context: ReportContext, fileStem: string) => string;

function toFileStem(source: AuditSource, view: string): string {
  const target = source.kind === 'sample' ? source.sampleId : `html-${source.hash}`;
  return `semantic-a11y-${target}-${view}`;
}

function download(content: string, type: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  // 브라우저가 내려받기를 시작하기 전에 주소를 없애면 실패하는 경우가 있어 한 박자 늦게 해제한다
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function exportJson(report: AuditReport, context: ReportContext, fileStem: string): string {
  download(toReportJson(report, context), 'application/json', `${fileStem}.json`);
  return 'JSON 파일을 내려받았습니다.';
}

function exportMarkdown(report: AuditReport, context: ReportContext, fileStem: string): string {
  download(toMarkdown(toReportDocument(report, context)), 'text/markdown', `${fileStem}-${context.locale}.md`);
  return 'Markdown 파일을 내려받았습니다.';
}

// 전역 print CSS를 건드리지 않으려고, 리포트만 담은 문서를 새 창에 띄워 인쇄한다
function printPdf(report: AuditReport, context: ReportContext): string {
  const html = toPrintHtml(toReportDocument(report, context));
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const opened = window.open(url, '_blank');
  // 새 창이 문서를 다 읽기 전에 주소를 없애면 빈 창이 뜨므로 넉넉히 기다렸다 해제한다
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  if (!opened) return '팝업이 차단되어 인쇄 창을 열지 못했습니다. 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.';
  return '인쇄 창을 열었습니다. 대상에서 "PDF로 저장"을 고르면 PDF 파일이 됩니다.';
}

export function useExportReport() {
  const { data: report } = useCurrentAudit();
  const locale = usePlaygroundStore((state) => state.locale);
  const view = usePlaygroundStore((state) => state.view);
  const decisions = useReviewStore((state) => state.decisions);
  const [message, setMessage] = useState('');

  const run = (exportRun: ExportRun) => () => {
    if (!report) return;
    const context: ReportContext = { locale, view, generatedAt: new Date(), rejected: toRejectedSet(decisions) };
    setMessage(exportRun(report, context, toFileStem(report.source, view)));
  };

  return { exportJson: run(exportJson), exportMarkdown: run(exportMarkdown), printPdf: run(printPdf), message };
}
