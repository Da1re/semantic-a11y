import type { ReportDocument, ReportDocumentItem } from './report-document';

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// 근거·코드 조각에 점검 대상 HTML이 그대로 들어 있어서, 이스케이프하지 않으면 인쇄 창에서 실행·렌더링된다
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

function toMetaList(meta: ReportDocument['meta']): string {
  const rows = meta.map(({ label, value }) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`);
  return `<dl>${rows.join('')}</dl>`;
}

function toCode(label: string, code: string): string {
  return `<p class="code-label">${escapeHtml(label)}</p><pre><code>${escapeHtml(code)}</code></pre>`;
}

function toItemHtml(item: ReportDocumentItem, index: number, labels: ReportDocument['labels']): string {
  const fix = item.fix
    ? toCode(labels.before, item.fix.before) + toCode(labels.after, item.fix.after)
    : `<p><em>${escapeHtml(labels.noFix)}</em></p>`;
  return `<li><article>
<h3>${index + 1}. ${escapeHtml(item.title)}</h3>
${toMetaList(item.meta)}
<p>${escapeHtml(item.reason)}</p>
${toCode(labels.snippet, item.snippet)}
${fix}
</article></li>`;
}

// 인쇄 창은 이 앱의 CSS를 불러오지 않는 별도 문서라 Tailwind 토큰 대신 값을 직접 쓴다
export function toPrintHtml(doc: ReportDocument): string {
  const summaryRows = doc.summary.map(({ label, value }) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${value}</td></tr>`);
  return `<!doctype html>
<html lang="${doc.locale}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(doc.title)}</title>
<style>
body { font: 14px/1.6 'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif; color: #0f172a; margin: 24px; }
h1 { font-size: 22px; margin: 0 0 12px; }
h2 { font-size: 18px; margin: 24px 0 8px; }
h3 { font-size: 15px; margin: 0 0 6px; }
dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 12px; margin: 0 0 8px; }
dl div { display: contents; }
dt { font-weight: 700; color: #334155; }
dd { margin: 0; }
table { border-collapse: collapse; margin: 8px 0; }
th, td { border: 1px solid #cbd5e1; padding: 4px 10px; text-align: left; }
td { text-align: right; }
ol { padding-left: 0; list-style: none; }
article { border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-bottom: 12px; break-inside: avoid; }
.code-label { font-size: 12px; font-weight: 700; margin: 8px 0 2px; }
pre { white-space: pre-wrap; word-break: break-all; background: #f1f5f9; padding: 8px; border-radius: 4px; margin: 0; font-size: 12px; }
</style>
</head>
<body>
<h1>${escapeHtml(doc.title)}</h1>
${toMetaList(doc.meta)}
<table><tbody>${summaryRows.join('')}</tbody></table>
<h2>${escapeHtml(doc.itemsTitle)}</h2>
<ol>${doc.items.map((item, index) => toItemHtml(item, index, doc.labels)).join('\n')}</ol>
<script>addEventListener('load', () => print());</script>
</body>
</html>`;
}
